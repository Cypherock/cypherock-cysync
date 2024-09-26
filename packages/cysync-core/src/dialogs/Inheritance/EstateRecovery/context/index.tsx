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

import { ITabs, useMemoReturn, useTabsAndDialogs } from '~/hooks';
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
  ClearData,
  ConfirmClearData,
  AuthenticateClearData,
  Settings,
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
        name: lang.strings.dialogs.inheritanceEstateRecovery.instructions.name,
        dialogs: [
          <Settings key="Settings" />,
          <ClearData key="Clear Data" />,
          <ConfirmClearData key="Confirm Clear Data" />,
          <AuthenticateClearData key="Autheticate Clear Data" />,
        ],
      },
      {
        name: lang.strings.dialogs.inheritanceEstateRecovery.wallet.name,
        dialogs: [
          <WalletAuth key="Wallet authentication" />,
          <VerifyOTP key="Verify otp" />,
          <FetchData key="Syncing" />,
        ],
      },
      {
        name: lang.strings.dialogs.inheritanceEstateRecovery.decryption.name,
        dialogs: [<DecryptMessage key="Decrypt message" />],
      },
      {
        name: lang.strings.dialogs.inheritanceEstateRecovery.viewPin.name,
        dialogs: [<ViewPin key="View pin" />],
      },
      {
        name: lang.strings.dialogs.inheritanceEstateRecovery.viewMessage.name,
        dialogs: [<Message key="Decrypted message" />],
      },

      {
        name: lang.strings.dialogs.inheritanceEstateRecovery.confirmation.name,
        dialogs: [<Success key="Success message" />],
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

  const [userDetails, setUserDetails] = useState<IUserDetails | undefined>();
  const [selectedWallet, setSelectedWallet] = useState<IWallet | undefined>();
  const [unhandledError, setUnhandledError] = useState<any>();

  const onRetry = useCallback(() => {
    setUserDetails(undefined);
    setSelectedWallet(undefined);
    setUnhandledError(undefined);
    goTo(0, 0);
  }, []);

  const ctx = useMemoReturn({
    onNext,
    onPrevious,
    tabs,
    onClose,
    goTo,
    currentTab,
    currentDialog,
    isDeviceRequired,
    selectedWallet,
    setSelectedWallet,
    userDetails,
    unhandledError,
    onRetry,
  });

  return (
    <InheritanceEstateRecoveryDialogContext.Provider value={ctx}>
      {children}
    </InheritanceEstateRecoveryDialogContext.Provider>
  );
};

export function useInheritanceEstateRecoveryDialog(): InheritanceEstateRecoveryDialogContextInterface {
  return useContext(InheritanceEstateRecoveryDialogContext);
}
