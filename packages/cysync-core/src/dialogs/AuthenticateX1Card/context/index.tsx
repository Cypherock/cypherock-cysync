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

import { Email2FA, X1CardAuthProcess } from '../Dialogs';

export interface AuthenticateX1CardDialogContextInterface {
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

const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;

export const AuthenticateX1CardDialogContext: Context<AuthenticateX1CardDialogContextInterface> =
  createContext<AuthenticateX1CardDialogContextInterface>(
    {} as AuthenticateX1CardDialogContextInterface,
  );

export interface AuthenticateX1CardDialogProviderProps {
  children: ReactNode;
}

export const AuthenticateX1CardDialogProvider: FC<
  AuthenticateX1CardDialogProviderProps
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
    dispatch(closeDialog('authenticateX1Card'));
  };

  const tabs: ITabs = [
    {
      name: lang.strings.dialogs.auth.email2fa.title,
      dialogs: [<Email2FA key="authenticate-x1-card-email -2fa" />],
    },
    {
      name: lang.strings.dialogs.auth.authX1Card.title,
      dialogs: [
        <X1CardAuthProcess key="authenticate-x1-card-device-process" />,
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
    <AuthenticateX1CardDialogContext.Provider value={ctx}>
      {children}
    </AuthenticateX1CardDialogContext.Provider>
  );
};

export function useAuthenticateX1CardDialog(): AuthenticateX1CardDialogContextInterface {
  return useContext(AuthenticateX1CardDialogContext);
}
