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

import { AddPassword } from '../Dialogs';

export interface SetPasswordDialogContextInterface {
  tabs: ITabs;
  isDeviceRequired: boolean;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  error: string | null;
  newPassword: string;
  confirmNewPassword: string;
  handleNewPasswordChange: (val: string) => void;
  handleConfirmNewPasswordChange: (val: string) => void;
}

export const SetPasswordDialogContext: Context<SetPasswordDialogContextInterface> =
  createContext<SetPasswordDialogContextInterface>(
    {} as SetPasswordDialogContextInterface,
  );

export interface SetPasswordDialogProviderProps {
  children: ReactNode;
}

export const SetPasswordDialogProvider: FC<SetPasswordDialogProviderProps> = ({
  children,
}) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};

  const [error, setError] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

  const validateNewPassword = () => {
    if (newPassword !== confirmNewPassword) {
      setError(lang.strings.dialogs.password.error.mismatchError);
      return;
    }
    setError(null);
  };
  useEffect(validateNewPassword, [newPassword, confirmNewPassword]);

  const onClose = () => {
    dispatch(closeDialog('setPassword'));
  };

  const handleNewPasswordChange = (val: string) => {
    setNewPassword(val);
  };

  const handleConfirmNewPasswordChange = (val: string) => {
    setConfirmNewPassword(val);
  };

  const tabs: ITabs = [
    {
      name: lang.strings.settings.tabs.app.title,
      dialogs: [<AddPassword key="remove-password-confirm" />],
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
      error,
      newPassword,
      confirmNewPassword,
      handleNewPasswordChange,
      handleConfirmNewPasswordChange,
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
      error,
      newPassword,
      confirmNewPassword,
      handleNewPasswordChange,
      handleConfirmNewPasswordChange,
    ],
  );

  return (
    <SetPasswordDialogContext.Provider value={ctx}>
      {children}
    </SetPasswordDialogContext.Provider>
  );
};

export function useSetPasswordDialog(): SetPasswordDialogContextInterface {
  return useContext(SetPasswordDialogContext);
}
