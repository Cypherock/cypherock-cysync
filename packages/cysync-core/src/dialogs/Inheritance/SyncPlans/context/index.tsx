import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { ITabs, useTabsAndDialogs } from '~/hooks';
import {
  inheritanceSyncPlansService,
  InheritanceSyncPlansStartResponse,
} from '~/services';
import { closeDialog, useAppDispatch } from '~/store';

import { EnterEmail, VerifyEmail } from '../Dialogs';

export interface InheritanceSyncPlansDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  onClose: () => void;
  email: string;
  onEnterEmail: (email: string) => void;
  isSendingEmail: boolean;
  startResponse?: InheritanceSyncPlansStartResponse;
  unhandledError?: any;
  sendingEmailError?: string;
  onRetry: () => void;
  resetServerErrors: () => void;
  otpLength: number;
  verifyEmail: (otp: string) => void;
  isVerifyingEmail: boolean;
  verifyingEmailError?: string;
  onResendOtp: () => void;
  isResendingOtp: boolean;
  resendOtpError?: string;
  retriesRemaining: number;
  otpExpireTime?: string;
  wrongOtpError?: boolean;
}

export const InheritanceSyncPlansDialogContext: Context<InheritanceSyncPlansDialogContextInterface> =
  createContext<InheritanceSyncPlansDialogContextInterface>(
    {} as InheritanceSyncPlansDialogContextInterface,
  );

export interface InheritanceSyncPlansDialogContextProviderProps {
  children: ReactNode;
}

export const InheritanceSyncPlansDialogProvider: FC<
  InheritanceSyncPlansDialogContextProviderProps
> = ({ children }) => {
  const dispatch = useAppDispatch();

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};
  const tabs: ITabs = [
    {
      name: 'Enter Email',
      dialogs: [<EnterEmail key="EnterEmail" />],
    },
    {
      name: 'Verify Email',
      dialogs: [<VerifyEmail key="Verify Email" />],
    },
  ];

  const {
    onNext,
    onPrevious,
    goTo,
    currentTab,
    currentDialog,
    isDeviceRequired,
  } = useTabsAndDialogs({
    deviceRequiredDialogsMap,
    tabs,
    dialogName: 'inheritanceSyncPlans',
  });

  const onClose = () => {
    dispatch(closeDialog('inheritanceSyncPlans'));
  };

  const [email, setEmail] = useState('');
  const [startResponse, setStartResponse] = useState<
    InheritanceSyncPlansStartResponse | undefined
  >(undefined);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [unhandledError, setUnhandledError] = useState<any>();
  const [sendingEmailError, setSendingEmailError] = useState<
    string | undefined
  >();
  const [otpLength, setOtpLength] = useState<number>(6);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [verifyingEmailError, setVerifyingEmailError] = useState<
    string | undefined
  >();
  const [wrongOtpError, setWrongOtpError] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [resendOtpError, setResendOtpError] = useState<string | undefined>();
  const [retriesRemaining, setRetriesRemaining] = useState<number>(3);
  const [otpExpireTime, setOtpExpireTime] = useState<string>('');

  const sendEmail = useCallback(async (params: { email: string }) => {
    setIsSendingEmail(true);
    setSendingEmailError(undefined);
    try {
      const response = await inheritanceSyncPlansService.start(params);
      if (response.result) {
        setOtpExpireTime(response.result.otpExpiry);
        setRetriesRemaining(response.result.retriesRemaining);
        setOtpLength(response.result.otpLength);
        setStartResponse(response.result);
        goTo(1);
      } else {
        throw response.error;
      }
    } catch (error) {
      setUnhandledError(error);
    } finally {
      setIsSendingEmail(false);
    }
  }, []);

  const onEnterEmail = useCallback(
    (val: string) => {
      setEmail(val);
      sendEmail({ email: val });
    },
    [sendEmail],
  );

  const onRetry = useCallback(() => {
    setIsSendingEmail(false);
    setSendingEmailError(undefined);
    setUnhandledError(undefined);
    setStartResponse(undefined);
    goTo(0);
  }, []);

  const resetServerErrors = useCallback(() => {
    setSendingEmailError(undefined);
  }, []);

  const syncPlans = () => {
    // TODO: Implement this function
  };

  const verifyEmail = useCallback(
    async (otp: string) => {
      if (!startResponse) {
        return;
      }

      setIsVerifyingEmail(true);
      setVerifyingEmailError(undefined);
      try {
        const response = await inheritanceSyncPlansService.verify({
          requestId: startResponse.requestId,
          otp,
        });
        if (response.result) {
          if (response.result.otpExpiry) {
            setOtpExpireTime(response.result.otpExpiry);
          }

          if (response.result.retriesRemaining !== undefined) {
            setRetriesRemaining(response.result.retriesRemaining);
          }

          if (response.result.isSuccess && response.result.plans) {
            syncPlans();
            onClose();
          }

          if (!response.result.isSuccess) {
            setWrongOtpError(true);
          }
        } else {
          throw response.error;
        }
      } catch (error) {
        setUnhandledError(error);
      } finally {
        setIsVerifyingEmail(false);
      }
    },
    [startResponse],
  );

  const onResendOtp = useCallback(async () => {
    if (!startResponse) {
      return;
    }

    setIsResendingOtp(true);
    setResendOtpError(undefined);

    try {
      const response = await inheritanceSyncPlansService.resendOTP({
        requestId: startResponse.requestId,
      });

      if (response.result) {
        setOtpExpireTime(response.result.otpExpiry);
        setRetriesRemaining(response.result.retriesRemaining);
      } else {
        throw response.error;
      }
    } catch (error) {
      setUnhandledError(error);
    } finally {
      setIsResendingOtp(false);
    }
  }, [startResponse]);

  const ctx = useMemo(
    () => ({
      onNext,
      onPrevious,
      tabs,
      onClose,
      goTo,
      currentTab,
      currentDialog,
      isDeviceRequired,
      email,
      onEnterEmail,
      isSendingEmail,
      startResponse,
      unhandledError,
      sendingEmailError,
      onRetry,
      resetServerErrors,
      otpLength,
      verifyEmail,
      isVerifyingEmail,
      verifyingEmailError,
      onResendOtp,
      isResendingOtp,
      resendOtpError,
      retriesRemaining,
      otpExpireTime,
      wrongOtpError,
    }),
    [
      onNext,
      onPrevious,
      tabs,
      onClose,
      goTo,
      currentTab,
      currentDialog,
      isDeviceRequired,
      email,
      onEnterEmail,
      isSendingEmail,
      startResponse,
      unhandledError,
      sendingEmailError,
      onRetry,
      resetServerErrors,
      otpLength,
      verifyEmail,
      isVerifyingEmail,
      verifyingEmailError,
      onResendOtp,
      isResendingOtp,
      resendOtpError,
      otpExpireTime,
      wrongOtpError,
    ],
  );

  return (
    <InheritanceSyncPlansDialogContext.Provider value={ctx}>
      {children}
    </InheritanceSyncPlansDialogContext.Provider>
  );
};

export function useInheritanceSyncPlansDialog(): InheritanceSyncPlansDialogContextInterface {
  return useContext(InheritanceSyncPlansDialogContext);
}
