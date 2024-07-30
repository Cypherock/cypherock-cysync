import { sleep } from '@cypherock/cysync-utils';
import { IWallet } from '@cypherock/db-interfaces';
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

import { Ensure, Instructions, SelectWallet, Terms } from '../Dialogs';

export interface IWalletWithDeleted extends IWallet {
  isDeleted?: boolean;
}

export interface InheritanceSilverPlanPurchaseDialogContextInterface {
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
  allWallets: IWalletWithDeleted[];
  selectedWallet?: IWalletWithDeleted;
  setSelectedWallet: (wallet: IWalletWithDeleted) => void;
}

export const InheritanceSilverPlanPurchaseDialogContext: Context<InheritanceSilverPlanPurchaseDialogContextInterface> =
  createContext<InheritanceSilverPlanPurchaseDialogContextInterface>(
    {} as InheritanceSilverPlanPurchaseDialogContextInterface,
  );

export interface InheritanceSilverPlanPurchaseDialogContextProviderProps {
  children: ReactNode;
}

export const InheritanceSilverPlanPurchaseDialogProvider: FC<
  InheritanceSilverPlanPurchaseDialogContextProviderProps
> = ({ children }) => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLanguage);

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(() => ({}), []);

  const tabs: ITabs = useMemo(
    () => [
      {
        name: lang.strings.inheritance.termsOfService.title,
        dialogs: [<Terms key="Terms" />, <Ensure key="Ensure" />],
      },
      {
        name: lang.strings.inheritanceSilverPlanPurchase.instructions.heading,
        dialogs: [<Instructions key="Instructions" />],
      },
      {
        name: lang.strings.inheritanceSilverPlanPurchase.selectWallet.heading,
        dialogs: [<SelectWallet key="Select Wallet" />],
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
    dialogName: 'inheritanceSilverPlanPurchase',
  });

  const onClose = () => {
    dispatch(closeDialog('inheritanceSilverPlanPurchase'));
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

  const wallets = useAppSelector(state => state.wallet.wallets);
  const deletedWallets = useAppSelector(state => state.wallet.deletedWallets);

  const allWallets = useMemo<IWalletWithDeleted[]>(() => {
    const deletedWalletIds = deletedWallets.map(e => e.__id);

    return [
      ...wallets.map(e => ({
        ...e,
        isDeleted: deletedWalletIds.includes(e.__id),
      })),
    ];
  }, [wallets, deletedWallets]);

  const [selectedWallet, setSelectedWallet] = useState<IWallet | undefined>();

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
      allWallets,
      selectedWallet,
      setSelectedWallet,
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
      allWallets,
      selectedWallet,
      setSelectedWallet,
    ],
  );

  return (
    <InheritanceSilverPlanPurchaseDialogContext.Provider value={ctx}>
      {children}
    </InheritanceSilverPlanPurchaseDialogContext.Provider>
  );
};

export function useInheritanceSilverPlanPurchaseDialog(): InheritanceSilverPlanPurchaseDialogContextInterface {
  return useContext(InheritanceSilverPlanPurchaseDialogContext);
}
