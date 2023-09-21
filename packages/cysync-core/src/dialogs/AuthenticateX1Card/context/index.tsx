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
import { validateEmail } from '~/utils';
import { AuthenticateX1CardSuccess } from '../Dialogs/Success';

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
  isSubmitDisabled: boolean;
}

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
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

  const validateInputEmail = () => {
    if (email.length === 0) {
      setError(null);
      return;
    }

    const validation = validateEmail(email, lang);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setError(null);
  };
  useEffect(validateInputEmail, [email]);

  const validateForm = () => {
    let isSubmitDisabledNew = Boolean(error);
    isSubmitDisabledNew ||= email.length === 0;

    setIsSubmitDisabled(isSubmitDisabledNew);
  };
  useEffect(validateForm, [email]);

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
      name: lang.strings.dialogs.auth.title,
      dialogs: [
        <X1CardAuthProcess key="authenticate-x1-card-device-process" />,
      ],
    },
    {
      name: lang.strings.dialogs.auth.authX1Card.success,
      dialogs: [
        <AuthenticateX1CardSuccess key="authenticate-x1-card-success" />,
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
      isSubmitDisabled,
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
      isSubmitDisabled,
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
