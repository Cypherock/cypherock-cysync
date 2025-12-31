// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import { ServerErrorType } from '@cypherock/cysync-core-constants';
import { createSelector } from '@reduxjs/toolkit';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';

import { setCantonAccountAuthTokens } from '~/actions/canton';
import { useTabsAndDialogs, ITabs, useMemoReturn } from '~/hooks';
import { cantonService } from '~/services/canton';
import {
  closeDialog,
  selectCantonAuthTokens,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import {
  UserDetails,
  VerifyOTP,
  SuccessDialog,
  LoaderDialog,
} from '../Dialogs';

export interface ICantonOtpVerificationDetails {
  email: string;
  retriesRemaining: number;
  otpExpiry: string;
  showIncorrectError?: boolean;
}

export interface CantonLoginDialogContextInterface {
  tabs: ITabs;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  onUserDetailsSubmit: () => void;
  isSubmittingUserDetails: boolean;
  email: string;
  setEmail: (email: string) => void;
  setHasErrors: (hasErrors: boolean) => void;
  onOTPSubmit: (otp: string) => void;
  isSubmittingOTP: boolean;
  otpVerificationDetails: ICantonOtpVerificationDetails | undefined;
  error: any | undefined;
  onRetry: () => void;
}

export const CantonLoginDialogContext: Context<CantonLoginDialogContextInterface> =
  createContext<CantonLoginDialogContextInterface>(
    {} as CantonLoginDialogContextInterface,
  );

const selector = createSelector(
  [selectLanguage, selectCantonAuthTokens],
  (lang, cantonAuthTokens) => ({
    lang,
    cantonAuthTokens,
  }),
);

export const CantonLoginDialogProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { lang } = useAppSelector(selector);
  const dispatch = useAppDispatch();

  const [isSubmittingUserDetails, setIsSubmittingUserDetails] = useState(false);
  const [email, setEmail] = useState('');
  const [hasErrors, setHasErrors] = useState(false);
  const [isSubmittingOTP, setIsSubmittingOTP] = useState(false);
  const [otpVerificationDetails, setOtpVerificationDetails] = useState<
    ICantonOtpVerificationDetails | undefined
  >();
  const [error, setError] = useState<any | undefined>();

  const resetOtpVerificationStates = () => {
    setIsSubmittingUserDetails(false);
    setIsSubmittingOTP(false);
    setOtpVerificationDetails(undefined);
  };

  useEffect(() => () => resetOtpVerificationStates(), []);

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(() => ({}), []);

  const tabs: ITabs = useMemo(
    () => [
      {
        name: lang.strings.addAccount.aside.tabs.device,
        dialogs: [
          <UserDetails />,
          <VerifyOTP />,
          <LoaderDialog />,
          <SuccessDialog />,
        ],
      },
    ],
    [lang],
  );

  const { onNext, onPrevious, goTo, currentTab, currentDialog } =
    useTabsAndDialogs({
      deviceRequiredDialogsMap,
      tabs,
      dialogName: 'cantonLogin',
    });

  const onClose = () => {
    setError(undefined);
    dispatch(closeDialog('cantonLogin'));
  };

  const onRetry = () => {
    setError(undefined);
    resetOtpVerificationStates();
    goTo(0, 0);
  };

  const onOtpVerificationSuccess = useCallback(() => {
    setOtpVerificationDetails(undefined);
    setIsSubmittingOTP(false);
    onNext();
  }, [onNext]);

  const onOtpVerificationFailure = useCallback(
    (otpExpiry: string, retriesRemaining: number) => {
      setOtpVerificationDetails({
        email,
        showIncorrectError: true,
        otpExpiry,
        retriesRemaining,
      });
      setIsSubmittingOTP(false);
    },
    [email],
  );

  const onUserDetailsSubmit = useCallback(async () => {
    if (hasErrors) return;
    setIsSubmittingUserDetails(true);
    setError(undefined);

    try {
      const response = await cantonService.login({ email });

      if (response.error) {
        setIsSubmittingUserDetails(false);
        setError(response.error);
        return;
      }

      setOtpVerificationDetails({
        email,
        retriesRemaining: response.result.otpDetails.retriesRemaining,
        otpExpiry: response.result.otpDetails.otpExpiry,
      });

      setIsSubmittingUserDetails(false);
      onNext();
    } catch (e) {
      setIsSubmittingUserDetails(false);
      setError(e);
    }
  }, [onNext, email, hasErrors]);

  const onOTPSubmit = useCallback(
    async (otp: string) => {
      setIsSubmittingOTP(true);
      setError(undefined);

      try {
        const response = await cantonService.loginOtpVerification({
          email,
          secret: otp,
        });

        if (response.error) {
          if (response.error.code === ServerErrorType.OTP_VERIFICATION_FAILED) {
            onOtpVerificationFailure(
              response.error.details?.responseBody.otpExpiry ??
                otpVerificationDetails?.otpExpiry,
              response.error.details?.responseBody.retriesRemaining ??
                otpVerificationDetails?.retriesRemaining,
            );
            setIsSubmittingOTP(false);
          } else {
            onOtpVerificationFailure(
              response.error.details?.responseBody.otpExpiry ??
                otpVerificationDetails?.otpExpiry,
              0,
            );
            setIsSubmittingOTP(false);
            setError(response.error);
          }
          return;
        }

        dispatch(
          setCantonAccountAuthTokens({
            accessToken: response.result.accessToken,
            refreshToken: response.result.refreshToken,
          }),
        );
        onOtpVerificationSuccess();
      } catch (e) {
        setIsSubmittingOTP(false);
        setError(e);
      }
    },
    [
      onOtpVerificationSuccess,
      email,
      setIsSubmittingOTP,
      otpVerificationDetails,
    ],
  );

  const ctx = useMemoReturn({
    tabs,
    currentTab,
    currentDialog,
    onNext,
    goTo,
    onPrevious,
    onClose,
    onUserDetailsSubmit,
    isSubmittingUserDetails,
    email,
    setEmail,
    setHasErrors,
    onOTPSubmit,
    isSubmittingOTP,
    otpVerificationDetails,
    error,
    onRetry,
  });

  return (
    <CantonLoginDialogContext.Provider value={ctx}>
      {children}
    </CantonLoginDialogContext.Provider>
  );
};

export function useCantonLoginDialog(): CantonLoginDialogContextInterface {
  return useContext(CantonLoginDialogContext);
}
