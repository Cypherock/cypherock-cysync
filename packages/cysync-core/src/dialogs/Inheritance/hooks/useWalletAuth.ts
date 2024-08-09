import { IInheritanceWalletAuthEvent } from '@cypherock/app-support-inheritance';
import { ServerErrorType } from '@cypherock/cysync-core-constants';
import lodash from 'lodash';
import { useState, useRef, useCallback } from 'react';
import { Subscription, Observer } from 'rxjs';

import { deviceLock, useDevice } from '~/context';
import { useAsync, useStateWithRef } from '~/hooks';
import {
  InheritanceLoginConcernMap,
  InheritanceLoginEmailTypeMap,
  InheritanceLoginInitResponse,
  InheritanceLoginRegisterResponse,
  inheritanceLoginService,
} from '~/services';
import { inheritanceSupport } from '~/utils';
import logger from '~/utils/logger';

export interface IUserDetails {
  name: string;
  email: string;
  alternateEmail: string;
}

export enum OtpVerificationConcern {
  primary = 'primary',
  alternate = 'alternate',
  login = 'login',
}

export interface IOtpVerificationDetails {
  id: string;
  concern: OtpVerificationConcern;
  email: string;
  retriesRemaining: number;
  otpExpiry: string;
  showIncorrectError?: boolean;
}

export interface IWalletAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const WalletAuthLoginStep = {
  fetchRequestId: 0,
  walletAuth: 1,
  validateSignature: 2,
  userDetails: 3,
  primaryOtpVerify: 4,
  alternateOtpVerify: 5,
  loginOtpVerify: 6,
  completed: 7,
} as const;

export type WalletAuthLoginStep =
  (typeof WalletAuthLoginStep)[keyof typeof WalletAuthLoginStep];

export const useWalletAuth = (onErrorCallback: (e?: any) => void) => {
  const { connection } = useDevice();
  const [deviceEvents, setDeviceEvents] = useState<
    Record<number, boolean | undefined>
  >({});
  const [currentStep, setCurrentStep] = useState<WalletAuthLoginStep>(
    WalletAuthLoginStep.fetchRequestId,
  );

  const flowSubscription = useRef<Subscription | undefined>();
  const walletRef = useRef<string | undefined>();
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
  const deviceResponse = useRef<
    { publicKey?: string; signature: string } | undefined
  >();
  const [authTokens, setAuthTokens] = useState<IWalletAuthTokens | undefined>(
    undefined,
  );

  const cleanUp = useCallback(() => {
    if (flowSubscription.current) {
      flowSubscription.current.unsubscribe();
      flowSubscription.current = undefined;
    }
  }, []);

  const onError = useCallback((e?: any) => {
    cleanUp();
    onErrorCallback(e);
  }, []);

  const getFlowObserver = useCallback(
    (onEnd: () => void): Observer<IInheritanceWalletAuthEvent> => ({
      next: payload => {
        if (payload.device) setDeviceEvents({ ...payload.device.events });
        if (payload.signature) {
          deviceResponse.current = {
            publicKey: payload.publicKey,
            signature: payload.signature,
          };
        }
      },
      error: err => {
        onEnd();
        onError(err);
      },
      complete: () => {
        setCurrentStep(WalletAuthLoginStep.validateSignature);
        cleanUp();
        onEnd();
      },
    }),
    [],
  );

  const fetchRequestIdCallback = useCallback(async (walletId: string) => {
    try {
      walletRef.current = walletId;
      const result = await inheritanceLoginService.init({ walletId });

      if (result.error) {
        throw result.error;
      }

      initResponse.current = result.result;

      setCurrentStep(WalletAuthLoginStep.walletAuth);
      return true;
    } catch (error) {
      onError(error);

      return false;
    }
  }, []);

  const [fetchRequestId, isFetchingRequestId] = useAsync(
    fetchRequestIdCallback,
  );

  const startWalletAuth = useCallback(async () => {
    logger.info('Starting wallet auth');

    if (
      !connection?.connection ||
      !walletRef.current ||
      !initResponse.current
    ) {
      return;
    }

    try {
      cleanUp();

      const taskId = lodash.uniqueId('task-');

      await deviceLock.acquire(connection.device, taskId);

      const onEnd = () => {
        deviceLock.release(connection.device, taskId);
      };

      const deviceConnection = connection.connection;

      flowSubscription.current = inheritanceSupport
        .walletAuth({
          connection: deviceConnection,
          walletId: walletRef.current,
          challenge: initResponse.current.challenge,
          isPublicKey:
            initResponse.current.concern ===
            InheritanceLoginConcernMap.REGISTER,
        })
        .subscribe(getFlowObserver(onEnd));
    } catch (e) {
      onError(e);
    }
  }, [connection]);

  const validateSignatureCallback = useCallback(async () => {
    try {
      if (
        !walletRef.current ||
        !initResponse.current ||
        !deviceResponse.current
      ) {
        return false;
      }

      const result = await inheritanceLoginService.validate({
        requestId: initResponse.current.requestId,
        publicKey: deviceResponse.current.publicKey,
        signature: deviceResponse.current.signature,
      });

      if (result.error) {
        throw result.error;
      }

      setCurrentStep(WalletAuthLoginStep.userDetails);
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

  const onVerifyOtpCallback = useCallback(async (otp: string) => {
    if (!initResponse.current || !otpVerificationDetailsRef.current) {
      return false;
    }

    if (
      otpVerificationDetailsRef.current.concern === OtpVerificationConcern.login
    ) {
      throw new Error('Not implemented');
    }

    if (!registerResponse.current || !userDetails.current) {
      return false;
    }

    const result = await inheritanceLoginService.registerVerify({
      requestId: initResponse.current.requestId,
      otp,
      emailType:
        otpVerificationDetailsRef.current.concern ===
        OtpVerificationConcern.primary
          ? InheritanceLoginEmailTypeMap.PRIMARY
          : InheritanceLoginEmailTypeMap.ALTERNATE,
    });

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
      setOtpVerificationDetails({
        id: 'alternateVerificationOnRegister',
        concern: OtpVerificationConcern.alternate,
        email: userDetails.current.alternateEmail ?? '',
        ...registerResponse.current.otpDetails[1],
      });

      setCurrentStep(WalletAuthLoginStep.alternateOtpVerify);
    } else {
      if (!result.result.accessToken || !result.result.refreshToken) {
        throw new Error('Server error');
      }

      setOtpVerificationDetails(undefined);
      setAuthTokens({
        accessToken: result.result.accessToken,
        refreshToken: result.result.refreshToken,
      });
      setCurrentStep(WalletAuthLoginStep.completed);
    }

    return true;
  }, []);

  const [verifyOtp, isVerifyingOtp] = useAsync(onVerifyOtpCallback, onError);

  const reset = useCallback(() => {
    walletRef.current = undefined;
    initResponse.current = undefined;
    deviceResponse.current = undefined;
    userDetails.current = undefined;
    registerResponse.current = undefined;
    setDeviceEvents({});
    setOtpVerificationDetails(undefined);
    cleanUp();
    setCurrentStep(WalletAuthLoginStep.fetchRequestId);
  }, [cleanUp]);

  return {
    fetchRequestId,
    isFetchingRequestId,
    startWalletAuth,
    deviceEvents,
    validateSignature,
    isValidatingSignature,
    reset,
    currentStep,
    registerUser,
    isRegisteringUser,
    abortWalletAuth: cleanUp,
    otpVerificationDetails,
    authTokens,
    verifyOtp,
    isVerifyingOtp,
  };
};
