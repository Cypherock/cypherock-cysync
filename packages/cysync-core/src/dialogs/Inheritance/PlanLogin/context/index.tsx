import { sleep } from '@cypherock/cysync-utils';
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
import { inheritanceLoginService } from '~/services';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { WalletAuth, VerifyEmail, FetchData } from '../Dialogs';

export interface InheritancePlanLoginDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  onClose: () => void;
  startWalletAuth: () => void;
  emails: string[];
  isAuthenticatingWallet: boolean;
  unhandledError?: any;
  onRetry: () => void;
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

export const InheritancePlanLoginDialogContext: Context<InheritancePlanLoginDialogContextInterface> =
  createContext<InheritancePlanLoginDialogContextInterface>(
    {} as InheritancePlanLoginDialogContextInterface,
  );

export interface InheritancePlanLoginDialogContextProviderProps {
  children: ReactNode;
}

export const InheritancePlanLoginDialogProvider: FC<
  InheritancePlanLoginDialogContextProviderProps
> = ({ children }) => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLanguage);

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        0: [0],
      }),
      [],
    );

  const tabs: ITabs = useMemo(
    () => [
      {
        name: 'Wallet Auth',
        dialogs: [<WalletAuth key="Wallet Auth" />],
      },
      {
        name: 'Verify Email',
        dialogs: [<VerifyEmail key="Verify Email" />],
      },
      {
        name: 'Fetch Data',
        dialogs: [<FetchData key="Fetch Data" />],
      },
    ],
    [],
  );

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
    dialogName: 'inheritancePlanLogin',
  });

  const onClose = () => {
    dispatch(closeDialog('inheritancePlanLogin'));
  };

  const [emails, setEmails] = useState<string[]>([]);
  const [isAuthenticatingWallet, setIsAuthenticatingWallet] = useState(false);
  const [unhandledError, setUnhandledError] = useState<any>();
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

  const startWalletAuth = useCallback(async () => {
    setIsAuthenticatingWallet(true);
    try {
      await sleep(2000);
      setEmails(['dummy@dum.com', 'test@dum.com']);
      setOtpLength(6);
      goTo(1);
    } catch (error) {
      setUnhandledError(error);
    } finally {
      setIsAuthenticatingWallet(false);
    }
  }, []);

  const onRetry = useCallback(() => {
    setIsAuthenticatingWallet(false);
    setUnhandledError(undefined);
    goTo(0);
  }, []);

  const fetchPlanData = async () => {
    try {
      await sleep(2000);
      onClose();
    } catch (error) {
      setUnhandledError(error);
    }
  };

  const verifyEmail = useCallback(async (otp: string) => {
    setIsVerifyingEmail(true);
    setVerifyingEmailError(undefined);
    try {
      const response = await inheritanceLoginService.verify({
        requestId: '',
        otp,
      });
      if (response.result) {
        if (response.result.otpExpiry) {
          setOtpExpireTime(response.result.otpExpiry);
        }

        if (response.result.retriesRemaining !== undefined) {
          setRetriesRemaining(response.result.retriesRemaining);
        }

        if (response.result.isSuccess) {
          goTo(2);
          fetchPlanData();
        }

        if (!response.result.isSuccess) {
          setWrongOtpError(true);
        }
      } else {
        setVerifyingEmailError(response.error ?? lang.strings.errors.default);
      }
    } catch (error) {
      setUnhandledError(error);
    } finally {
      setIsVerifyingEmail(false);
    }
  }, []);

  const onResendOtp = useCallback(async () => {
    setIsResendingOtp(true);
    setResendOtpError(undefined);

    try {
      const response = await inheritanceLoginService.resendOTP({
        requestId: '',
      });

      if (response.result) {
        setOtpExpireTime(response.result.otpExpiry);
        setRetriesRemaining(response.result.retriesRemaining);
      } else {
        setResendOtpError(response.error ?? lang.strings.errors.default);
      }
    } catch (error) {
      setUnhandledError(error);
    } finally {
      setIsResendingOtp(false);
    }
  }, []);

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
      emails,
      isAuthenticatingWallet,
      unhandledError,
      onRetry,
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
      startWalletAuth,
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
      emails,
      isAuthenticatingWallet,
      unhandledError,
      onRetry,
      otpLength,
      verifyEmail,
      isVerifyingEmail,
      verifyingEmailError,
      onResendOtp,
      isResendingOtp,
      resendOtpError,
      otpExpireTime,
      wrongOtpError,
      startWalletAuth,
    ],
  );

  return (
    <InheritancePlanLoginDialogContext.Provider value={ctx}>
      {children}
    </InheritancePlanLoginDialogContext.Provider>
  );
};

export function useInheritancePlanLoginDialog(): InheritancePlanLoginDialogContextInterface {
  return useContext(InheritancePlanLoginDialogContext);
}
