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
  DecryptMessage,
  FetchData,
  Terms,
  VerifyOTP,
  ViewPin,
  WalletAuth,
  Message,
  Success,
  WalletTransfer,
} from '../Dialogs';

export interface IWalletWithDeleted extends IWallet {
  isDeleted?: boolean;
}

export interface IUserDetails {
  name: string;
  email: string;
  alternateEmail: string;
}

export interface InheritanceEstateRecoveryDialogContextInterface {
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
  userDetails?: IUserDetails;
  unhandledError?: any;
  onRetry: () => void;
}

export const InheritanceEstateRecoveryDialogContext: Context<InheritanceEstateRecoveryDialogContextInterface> =
  createContext<InheritanceEstateRecoveryDialogContextInterface>(
    {} as InheritanceEstateRecoveryDialogContextInterface,
  );

export interface InheritanceEstateRecoveryDialogContextProviderProps {
  children: ReactNode;
}

export const InheritanceEstateRecoveryDialogProvider: FC<
  InheritanceEstateRecoveryDialogContextProviderProps
> = ({ children }) => {
  const dispatch = useAppDispatch();
  const lang = useAppSelector(selectLanguage);

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};
  const tabs: ITabs = useMemo(
    () => [
      {
        name: lang.strings.inheritance.termsOfService.title,
        dialogs: [<Terms key="Terms of services" />],
      },
      {
        name: lang.strings.dialogs.inheritanceEstateRecovery.walletAuth.name,
        dialogs: [
          <WalletAuth key="Wallet authentication" />,
          <VerifyOTP key="Verify otp" />,
          <FetchData key="Syncing" />,
        ],
      },
      {
        name: lang.strings.dialogs.inheritanceEstateRecovery.decryption.name,
        dialogs: [
          <DecryptMessage key="Decrypt message" />,
          <ViewPin key="View pin" />,
          <Message key="Decrypted message" />,
        ],
      },
      {
        name: lang.strings.dialogs.inheritanceEstateRecovery.confirmation.name,
        dialogs: [
          <Success key="Success message" />,
          <WalletTransfer key="Wallet transfer" />,
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
    dialogName: 'inheritanceEstateRecovery',
  });

  const onClose = () => {
    dispatch(closeDialog('inheritanceEstateRecovery'));
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
  const [unhandledError, setUnhandledError] = useState<any>();

  const onRetry = useCallback(() => {
    setUserDetails(undefined);
    setSelectedWallet(undefined);
    setUnhandledError(undefined);
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
      userDetails,
      unhandledError,
      onRetry,
    ],
  );

  return (
    <InheritanceEstateRecoveryDialogContext.Provider value={ctx}>
      {children}
    </InheritanceEstateRecoveryDialogContext.Provider>
  );
};

export function useInheritanceEstateRecoveryDialog(): InheritanceEstateRecoveryDialogContextInterface {
  return useContext(InheritanceEstateRecoveryDialogContext);
}
