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

import { X1CardEmail2FA, X1CardAuthProcessWithDevice } from '../Dialogs';
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

  const onClose = () => {
    dispatch(closeDialog('authenticateX1Card'));
  };

  const tabs: ITabs = [
    {
      name: lang.strings.dialogs.auth.email2fa.title,
      dialogs: [<X1CardEmail2FA key="authenticate-x1-card-email -2fa" />],
    },
    {
      name: lang.strings.dialogs.auth.title,
      dialogs: [
        <X1CardAuthProcessWithDevice key="authenticate-x1-card-device-process" />,
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
    <AuthenticateX1CardDialogContext.Provider value={ctx}>
      {children}
    </AuthenticateX1CardDialogContext.Provider>
  );
};

export function useAuthenticateX1CardDialog(): AuthenticateX1CardDialogContextInterface {
  return useContext(AuthenticateX1CardDialogContext);
}
