import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react';

import { ITabs, useTabsAndDialogs } from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { X1VaultEmail2FA, X1VaultAuthProcessWithDevice } from '../Dialogs';
import { AuthenticateX1VaultSuccess } from '../Dialogs/Success';

export interface AuthenticateX1VaultDialogContextInterface {
  tabs: ITabs;
  isDeviceRequired: boolean;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
}

export const AuthenticateX1VaultDialogContext: Context<AuthenticateX1VaultDialogContextInterface> =
  createContext<AuthenticateX1VaultDialogContextInterface>(
    {} as AuthenticateX1VaultDialogContextInterface,
  );

export interface AuthenticateX1VaultDialogProviderProps {
  children: ReactNode;
}

export const AuthenticateX1VaultDialogProvider: FC<
  AuthenticateX1VaultDialogProviderProps
> = ({ children }) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};

  const onClose = () => {
    dispatch(closeDialog('authenticateX1Vault'));
  };

  const tabs: ITabs = [
    {
      name: lang.strings.dialogs.auth.email2fa.title,
      dialogs: [<X1VaultEmail2FA key="authenticate-x1-vault-email-2fa" />],
    },
    {
      name: lang.strings.dialogs.auth.title,
      dialogs: [
        <X1VaultAuthProcessWithDevice key="authenticate-x1-vault-device-process" />,
      ],
    },
    {
      name: lang.strings.dialogs.auth.authX1Vault.success,
      dialogs: [
        <AuthenticateX1VaultSuccess key="authenticate-x1-vault-success" />,
      ],
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
  });

  const ctx = useMemo(
    () => ({
      isDeviceRequired,
      currentTab,
      currentDialog,
      tabs,
      onNext,
      goTo,
      onPrevious,
      onClose,
    }),
    [
      isDeviceRequired,
      currentTab,
      currentDialog,
      tabs,
      onNext,
      goTo,
      onPrevious,
      onClose,
    ],
  );

  return (
    <AuthenticateX1VaultDialogContext.Provider value={ctx}>
      {children}
    </AuthenticateX1VaultDialogContext.Provider>
  );
};

export function useAuthenticateX1VaultDialog(): AuthenticateX1VaultDialogContextInterface {
  return useContext(AuthenticateX1VaultDialogContext);
}
