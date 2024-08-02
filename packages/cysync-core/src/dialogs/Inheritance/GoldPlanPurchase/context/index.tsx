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
} from '../Dialogs';

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
  unhandledError?: any;
  onRetry: () => void;
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
        name: lang.strings.inheritanceGoldPlanPurchase.encryption.heading,
        dialogs: [
          <DeviceEncryption key="Device Encryption" />,
          <EncryptionLoader key="Encryption Loader" />,
          <EncryptionSuccess key="Encryption Success" />,
        ],
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
  const [selectedWallet, setSelectedWallet] = useState<IWallet | undefined>();
  const [isSubmittingUserDetails, setIsSubmittingUserDetails] = useState(false);
  const [unhandledError, setUnhandledError] = useState<any>();

  const onUserDetailsSubmit = useCallback(async (params: IUserDetails) => {
    setIsSubmittingUserDetails(true);
    setUserDetails(params);
    await sleep(2000);
    setIsSubmittingUserDetails(false);
    goTo(4, 1);
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
