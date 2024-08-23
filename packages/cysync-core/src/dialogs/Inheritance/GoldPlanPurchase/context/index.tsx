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
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import {
  DeviceEncryption,
  EncryptionLoader,
  EncryptionSuccess,
  Ensure,
  Instructions,
  SelectWallet,
  Terms,
  UserDetails,
  VerifyOTP,
  WalletAuth,
  Nominee,
  NomineeDetails,
  VerifyNomineeOtp,
  ConfirmNomineeVerification,
  ExecutorDetails,
  SelectExecutor,
  ExecutorMessageTutorial,
  ExecutorMessage,
  ExecutorReminderSetup,
  Checkout,
  NomineePrivateMessageInput,
  ConfirmOnDevice,
} from '../Dialogs';
import { Greeting } from '../Dialogs/Greeting';

export interface IWalletWithDeleted extends IWallet {
  isDeleted?: boolean;
}

export interface IUserDetails {
  name: string;
  email: string;
  alternateEmail: string;
}

export interface InheritanceGoldPlanPurchaseDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  onClose: () => void;
  allWallets: IWalletWithDeleted[];
  selectedWallet?: IWalletWithDeleted;
  setSelectedWallet: (wallet: IWalletWithDeleted) => void;
  onUserDetailsSubmit: (params: IUserDetails) => void;
  isSubmittingUserDetails: boolean;
  userDetails?: IUserDetails;
  onNomineeDetailsSubmit: (params: IUserDetails) => void;
  isSubmittingNomineeDetails: boolean;
  nomineeDetails?: IUserDetails;
  unhandledError?: any;
  onRetry: () => void;
  nomineeCount: number;
  setNomineeCount: (nomineeCount: number) => void;
  isSubmittingExecutorDetails: boolean;
  onExecutorDetailsSubmit: (params: IUserDetails) => void;
}

export const InheritanceGoldPlanPurchaseDialogContext: Context<InheritanceGoldPlanPurchaseDialogContextInterface> =
  createContext<InheritanceGoldPlanPurchaseDialogContextInterface>(
    {} as InheritanceGoldPlanPurchaseDialogContextInterface,
  );

export interface InheritanceGoldPlanPurchaseDialogContextProviderProps {
  children: ReactNode;
}

export const InheritanceGoldPlanPurchaseDialogProvider: FC<
  InheritanceGoldPlanPurchaseDialogContextProviderProps
> = ({ children }) => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLanguage);

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        3: [0],
      }),
      [],
    );

  const tabs: ITabs = useMemo(
    () => [
      {
        name: lang.strings.inheritance.termsOfService.title,
        dialogs: [<Terms key="Terms" />, <Ensure key="Ensure" />],
      },
      {
        name: lang.strings.inheritanceGoldPlanPurchase.instructions.heading,
        dialogs: [<Instructions key="Instructions" />],
      },
      {
        name: lang.strings.inheritanceGoldPlanPurchase.selectWallet.heading,
        dialogs: [<SelectWallet key="Select Wallet" />],
      },
      {
        name: lang.strings.inheritanceGoldPlanPurchase.walletAuth.heading,
        dialogs: [<WalletAuth key="Wallet Auth" />],
      },
      {
        name: lang.strings.inheritanceGoldPlanPurchase.email.heading,
        dialogs: [
          <UserDetails key="User Details" />,
          <VerifyOTP key="Verify OTP" />,
        ],
      },
      {
        name: lang.strings.inheritanceGoldPlanPurchase.nomineeAndExecutor
          .heading,
        dialogs: [
          <Nominee key="Nominee" />,
          <NomineeDetails key="Nominee Details" />,
          <ConfirmNomineeVerification key="Confirm Nominee Verification" />,
          <VerifyNomineeOtp key="Verify Nominee Otp" />,
          <SelectExecutor key="Confirm Executor" />,
          <ExecutorDetails key="Executor Details" />,
        ],
      },
      {
        name: lang.strings.inheritanceGoldPlanPurchase.message.heading,
        dialogs: [
          <ExecutorMessageTutorial key="Message Tutorial" />,
          <NomineePrivateMessageInput key="Executor Private Message" />,
          <ExecutorMessage key="Executor Message" />,
        ],
      },
      {
        name: lang.strings.inheritanceGoldPlanPurchase.reminder.heading,
        dialogs: [<ExecutorReminderSetup key="Reminder Setup" />],
      },
      {
        name: lang.strings.inheritanceGoldPlanPurchase.encryption.heading,
        dialogs: [
          <ConfirmOnDevice key="Confirm On Device" />,
          <DeviceEncryption key="Device Encryption" />,
          <EncryptionLoader key="Encryption Loader" />,
          <EncryptionSuccess key="Encryption Success" />,
        ],
      },
      {
        name: lang.strings.inheritanceGoldPlanPurchase.checkout.heading,
        dialogs: [<Checkout key="Checkout" />, <Greeting key="Greeting" />],
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
    dialogName: 'inheritanceGoldPlanPurchase',
  });

  const onClose = () => {
    dispatch(closeDialog('inheritanceGoldPlanPurchase'));
  };

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

  const [userDetails, setUserDetails] = useState<IUserDetails | undefined>();
  const [nomineeDetails, setNomineeDetails] = useState<
    IUserDetails | undefined
  >();
  const [executorDetails, setExecutorDetails] = useState<
    IUserDetails | undefined
  >();
  const [selectedWallet, setSelectedWallet] = useState<IWallet | undefined>();
  const [isSubmittingUserDetails, setIsSubmittingUserDetails] = useState(false);
  const [isSubmittingExecutorDetails, setIsSubmittingExecutorDetails] =
    useState(false);
  const [isSubmittingNomineeDetails, setIsSubmittingNomineeDetails] =
    useState(false);
  const [unhandledError, setUnhandledError] = useState<any>();
  const [nomineeCount, setNomineeCount] = useState(1);

  const onUserDetailsSubmit = useCallback(async (params: IUserDetails) => {
    setIsSubmittingUserDetails(true);
    setUserDetails(params);
    await sleep(2000);
    setIsSubmittingUserDetails(false);
    goTo(4, 1);
  }, []);

  const onNomineeDetailsSubmit = useCallback(async (params: IUserDetails) => {
    setIsSubmittingNomineeDetails(true);
    setNomineeDetails(params);
    await sleep(2000);
    setIsSubmittingNomineeDetails(false);
    goTo(5, 2);
  }, []);

  const onExecutorDetailsSubmit = useCallback(async (params: IUserDetails) => {
    setIsSubmittingExecutorDetails(true);
    setExecutorDetails(params);
    await sleep(2000);
    setIsSubmittingExecutorDetails(false);
  }, []);

  const onRetry = useCallback(() => {
    setUserDetails(undefined);
    setSelectedWallet(undefined);
    setUnhandledError(undefined);
    setIsSubmittingUserDetails(false);
    goTo(0, 0);
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
      allWallets,
      selectedWallet,
      setSelectedWallet,
      onUserDetailsSubmit,
      isSubmittingUserDetails,
      userDetails,
      unhandledError,
      onRetry,
      onNomineeDetailsSubmit,
      isSubmittingNomineeDetails,
      onExecutorDetailsSubmit,
      isSubmittingExecutorDetails,
      executorDetails,
      nomineeDetails,
      nomineeCount,
      setNomineeCount,
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
      allWallets,
      selectedWallet,
      setSelectedWallet,
      onUserDetailsSubmit,
      isSubmittingUserDetails,
      userDetails,
      unhandledError,
      onRetry,
      onNomineeDetailsSubmit,
      isSubmittingNomineeDetails,
      onExecutorDetailsSubmit,
      isSubmittingExecutorDetails,
      executorDetails,
      nomineeDetails,
      nomineeCount,
      setNomineeCount,
    ],
  );

  return (
    <InheritanceGoldPlanPurchaseDialogContext.Provider value={ctx}>
      {children}
    </InheritanceGoldPlanPurchaseDialogContext.Provider>
  );
};

export function useInheritanceGoldPlanPurchaseDialog(): InheritanceGoldPlanPurchaseDialogContextInterface {
  return useContext(InheritanceGoldPlanPurchaseDialogContext);
}
