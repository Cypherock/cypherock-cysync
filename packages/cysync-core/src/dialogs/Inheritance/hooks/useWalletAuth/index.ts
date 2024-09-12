import { ServerErrorType } from '@cypherock/cysync-core-constants';
import { useState, useRef, useCallback, useMemo } from 'react';

import { useAsync, useStateWithRef } from '~/hooks';
import {
  InheritanceLoginConcernMap,
  InheritanceLoginEmailTypeMap,
  InheritanceLoginInitResponse,
  InheritanceLoginRegisterResponse,
  inheritanceLoginService,
  InheritanceLoginVerifyResponse,
} from '~/services';
import { ServerResponseWithError } from '~/services/utils';
import {
  IWalletAuthTokens,
  selectInheritanceAuthTokens,
  updateWalletAuthTokens,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import logger from '~/utils/logger';

import {
  WalletAuthLoginStep,
  IUserDetails,
  IOtpVerificationDetails,
  OtpVerificationConcern,
} from './types';
import { useWalletAuthDevice } from './useWalletAuthDevice';

export * from './types';

export const useWalletAuth = (onErrorCallback: (e?: any) => void) => {
  const dispatch = useAppDispatch();

  const authTokensPerWallet = useAppSelector(selectInheritanceAuthTokens);

  const [currentStep, setCurrentStep] = useState<WalletAuthLoginStep>(
    WalletAuthLoginStep.fetchRequestId,
  );

  const walletIdRef = useRef<string | undefined>();
  const initResponse = useRef<InheritanceLoginInitResponse | undefined>();
  const registerResponse = useRef<
    InheritanceLoginRegisterResponse | undefined
  >();
  const userDetails = useRef<IUserDetails | undefined>();
  const [
    otpVerificationDetails,
    setOtpVerificationDetails,
    otpVerificationDetailsRef,
  ] = useStateWithRef<IOtpVerificationDetails | undefined>(undefined);
  const [isRegisterationRequired, setIsRegisterationRequired] = useState(false);
  const [authTokens, setAuthTokens] = useState<IWalletAuthTokens | undefined>(
    undefined,
  );

  const onWalletAuthDeviceCallback = useCallback(() => {
    setCurrentStep(WalletAuthLoginStep.validateSignature);
  }, []);

  const deviceWalletAuth = useWalletAuthDevice(
    onErrorCallback,
    onWalletAuthDeviceCallback,
  );

  const onError = useCallback(
    (e?: any) => {
      logger.error('Error on useWalletAuth');
      logger.error(e);
      deviceWalletAuth.cleanUp();
      onErrorCallback(e);
    },
    [onErrorCallback, deviceWalletAuth.cleanUp],
  );

  const onLogin = useCallback(
    (accessToken: string, refreshToken: string) => {
      if (!walletIdRef.current) return;

      dispatch(
        updateWalletAuthTokens({
          walletId: walletIdRef.current,
          authTokens: { accessToken, refreshToken },
        }),
      );
      setAuthTokens({ accessToken, refreshToken });
      setCurrentStep(WalletAuthLoginStep.completed);
    },
    [dispatch],
  );

  const startWalletAuth = useCallback(() => {
    if (!walletIdRef.current || !initResponse.current) {
      return false;
    }

    deviceWalletAuth.startWalletAuth({
      walletId: walletIdRef.current,
      challenge: initResponse.current.challenge,
      isPublicKey:
        initResponse.current.concern === InheritanceLoginConcernMap.REGISTER,
    });

    return true;
  }, [deviceWalletAuth.startWalletAuth]);

  const fetchRequestIdCallback = useCallback(
    async (walletId: string) => {
      try {
        walletIdRef.current = walletId;

        const existingTokens = authTokensPerWallet[walletId];
        if (existingTokens) {
          const result = await inheritanceLoginService.refreshAccessToken({
            refreshToken: existingTokens.refreshToken,
          });

          const isLoggedOut =
            result.error?.code === ServerErrorType.UNAUTHORIZED_ACCESS;

          if (result.result) {
            onLogin(result.result.authToken, existingTokens.refreshToken);
            return true;
          }

          if (!isLoggedOut) {
            throw result.error;
          }
        }

        const result = await inheritanceLoginService.init({ walletId });

        if (result.error) {
          throw result.error;
        }

        initResponse.current = result.result;
        setIsRegisterationRequired(
          result.result.concern === InheritanceLoginConcernMap.REGISTER,
        );

        setCurrentStep(WalletAuthLoginStep.walletAuth);
        return true;
      } catch (error) {
        onError(error);

        return false;
      }
    },
    [authTokensPerWallet, onLogin],
  );

  const [fetchRequestId, isFetchingRequestId] = useAsync(
    fetchRequestIdCallback,
  );

  const validateSignatureCallback = useCallback(async () => {
    try {
      if (
        !walletIdRef.current ||
        !initResponse.current ||
        !deviceWalletAuth.deviceResponse.current
      ) {
        return false;
      }

      const result = await inheritanceLoginService.validate({
        requestId: initResponse.current.requestId,
        publicKey: deviceWalletAuth.deviceResponse.current.publicKey,
        signature: deviceWalletAuth.deviceResponse.current.signature,
      });

      if (result.error) {
        throw result.error;
      }

      if (result.result.otpDetails) {
        setOtpVerificationDetails({
          id: 'emailVerificationOnLogin',
          concern: OtpVerificationConcern.login,
          email: result.result.otpDetails[0].maskedEmail,
          ...result.result.otpDetails[0],
        });
        setCurrentStep(WalletAuthLoginStep.loginOtpVerify);
      } else {
        setCurrentStep(WalletAuthLoginStep.userDetails);
      }
      return true;
    } catch (error) {
      onError(error);
    }

    return false;
  }, []);

  const [validateSignature, isValidatingSignature] = useAsync(
    validateSignatureCallback,
  );

  const registerUserCallback = useCallback(async (params: IUserDetails) => {
    if (!initResponse.current) {
      return false;
    }

    const result = await inheritanceLoginService.register({
      requestId: initResponse.current.requestId,
      name: params.name,
      email: params.email,
      alternateEmail: params.alternateEmail,
    });

    if (result.error) {
      throw result.error;
    }

    userDetails.current = params;
    registerResponse.current = result.result;

    setOtpVerificationDetails({
      id: 'primaryVerificationOnRegister',
      concern: OtpVerificationConcern.primary,
      email: params.email,
      ...result.result.otpDetails[0],
    });
    setCurrentStep(WalletAuthLoginStep.primaryOtpVerify);
    return true;
  }, []);

  const [registerUser, isRegisteringUser] = useAsync(
    registerUserCallback,
    onError,
  );

  const onVerifyOtpCallback = useCallback(
    async (otp: string) => {
      if (
        !walletIdRef.current ||
        !initResponse.current ||
        !otpVerificationDetailsRef.current
      ) {
        return false;
      }

      let result:
        | ServerResponseWithError<
            Pick<
              Partial<InheritanceLoginVerifyResponse>,
              'authToken' | 'refreshToken'
            >
          >
        | undefined;

      if (
        otpVerificationDetailsRef.current.concern ===
        OtpVerificationConcern.login
      ) {
        result = await inheritanceLoginService.verify({
          requestId: initResponse.current.requestId,
          otp,
        });
      } else {
        if (!registerResponse.current || !userDetails.current) {
          return false;
        }

        result = await inheritanceLoginService.registerVerify({
          requestId: initResponse.current.requestId,
          otp,
          emailType:
            otpVerificationDetailsRef.current.concern ===
            OtpVerificationConcern.primary
              ? InheritanceLoginEmailTypeMap.PRIMARY
              : InheritanceLoginEmailTypeMap.ALTERNATE,
        });
      }

      if (result.error) {
        if (result.error.code === ServerErrorType.OTP_VERIFICATION_FAILED) {
          setOtpVerificationDetails({
            ...otpVerificationDetailsRef.current,
            showIncorrectError: true,
            otpExpiry:
              result.error.details?.responseBody.otpExpiry ??
              otpVerificationDetailsRef.current.otpExpiry,
            retriesRemaining:
              result.error.details?.responseBody.retriesRemaining ??
              otpVerificationDetailsRef.current.retriesRemaining,
          });
          return false;
        }

        throw result.error;
      }

      if (
        otpVerificationDetailsRef.current.concern ===
        OtpVerificationConcern.primary
      ) {
        if (!registerResponse.current || !userDetails.current) {
          return false;
        }

        setOtpVerificationDetails({
          id: 'alternateVerificationOnRegister',
          concern: OtpVerificationConcern.alternate,
          email: userDetails.current.alternateEmail,
          ...registerResponse.current.otpDetails[1],
        });

        setCurrentStep(WalletAuthLoginStep.alternateOtpVerify);
      } else {
        if (!result.result.authToken || !result.result.refreshToken) {
          throw new Error('Server error');
        }

        setOtpVerificationDetails(undefined);
        onLogin(result.result.authToken, result.result.refreshToken);
      }

      return true;
    },
    [onLogin],
  );

  const [verifyOtp, isVerifyingOtp] = useAsync(onVerifyOtpCallback, onError);

  const reset = useCallback(() => {
    walletIdRef.current = undefined;
    initResponse.current = undefined;
    userDetails.current = undefined;
    registerResponse.current = undefined;
    setIsRegisterationRequired(false);
    setAuthTokens(undefined);
    setOtpVerificationDetails(undefined);
    deviceWalletAuth.reset();
    setCurrentStep(WalletAuthLoginStep.fetchRequestId);
  }, [deviceWalletAuth.reset]);

  return useMemo(
    () => ({
      fetchRequestId,
      isFetchingRequestId,
      startWalletAuth,
      deviceEvents: deviceWalletAuth.deviceEvents,
      validateSignature,
      isValidatingSignature,
      reset,
      currentStep,
      registerUser,
      isRegisteringUser,
      abortWalletAuth: deviceWalletAuth.cleanUp,
      otpVerificationDetails,
      authTokens,
      verifyOtp,
      isVerifyingOtp,
      isRegisterationRequired,
    }),
    [
      fetchRequestId,
      isFetchingRequestId,
      startWalletAuth,
      deviceWalletAuth.deviceEvents,
      validateSignature,
      isValidatingSignature,
      reset,
      currentStep,
      registerUser,
      isRegisteringUser,
      deviceWalletAuth.cleanUp,
      otpVerificationDetails,
      authTokens,
      verifyOtp,
      isVerifyingOtp,
      isRegisterationRequired,
    ],
  );
};
