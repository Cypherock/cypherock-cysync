import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
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

import { Email2FA } from '../Dialogs';

export interface AuthenticateX1VaultDialogContextInterface {
  tabs: ITabs;
  isDeviceRequired: boolean;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  email: string;
  handleEmailChange: (email: string) => void;
  error: string | null;
}

export const AuthenticateX1VaultDialogContext: Context<AuthenticateX1VaultDialogContextInterface> =
  createContext<AuthenticateX1VaultDialogContextInterface>(
    {} as AuthenticateX1VaultDialogContextInterface,
  );

export interface AuthenticateX1VaultDialogProviderProps {
  children: ReactNode;
}

const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

export const AuthenticateX1VaultDialogProvider: FC<
  AuthenticateX1VaultDialogProviderProps
> = ({ children }) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const validateEmail = () => {
    if (email.length > 0 && !emailRegex.test(email)) {
      setError('Invalid Email');
      return;
    }

    setError(null);
  };
  useEffect(validateEmail, [email]);

  const handleEmailChange = (_email: string) => {
    setEmail(_email);
  };

  const onClose = () => {
    dispatch(closeDialog('authenticateX1Vault'));
  };

  const tabs: ITabs = [
    {
      name: lang.strings.settings.tabs.app.title,
      dialogs: [<Email2FA key="authenticate-x1-vault-email-2fa" />],
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
      email,
      handleEmailChange,
      error,
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
      email,
      handleEmailChange,
      error,
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
