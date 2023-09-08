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

import { CreateNewPassword } from '../Dialogs';

export interface ChangePasswordDialogContextInterface {
  tabs: ITabs;
  isDeviceRequired: boolean;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  oldPassword: string;
  handleOldPasswordChange: (val: string) => void;
  newPassword: string;
  handleNewPasswordChange: (val: string) => void;
  confirmNewPassword: string;
  handleConfirmNewPasswordChange: (val: string) => void;
  error: string | null;
}

export const ChangePasswordDialogContext: Context<ChangePasswordDialogContextInterface> =
  createContext<ChangePasswordDialogContextInterface>(
    {} as ChangePasswordDialogContextInterface,
  );

export interface ChangePasswordDialogProviderProps {
  children: ReactNode;
}

export const ChangePasswordDialogProvider: FC<
  ChangePasswordDialogProviderProps
> = ({ children }) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};

  const [error, setError] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

  const validateNewPassword = () => {
    if (newPassword !== confirmNewPassword) {
      setError(lang.strings.dialogs.changePassword.error.passwordMismatch);
      return;
    }
    setError(null);
  };
  useEffect(validateNewPassword, [newPassword, confirmNewPassword]);

  const onClose = () => {
    dispatch(closeDialog('changePassword'));
  };

  const handleOldPasswordChange = (val: string) => {
    setOldPassword(val);
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
      dialogs: [<CreateNewPassword key="change-password-create-new" />],
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
      oldPassword,
      newPassword,
      confirmNewPassword,
      handleOldPasswordChange,
      handleNewPasswordChange,
      handleConfirmNewPasswordChange,
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
      oldPassword,
      newPassword,
      confirmNewPassword,
      handleOldPasswordChange,
      handleNewPasswordChange,
      handleConfirmNewPasswordChange,
      error,
    ],
  );

  return (
    <ChangePasswordDialogContext.Provider value={ctx}>
      {children}
    </ChangePasswordDialogContext.Provider>
  );
};

export function useChangePasswordDialog(): ChangePasswordDialogContextInterface {
  return useContext(ChangePasswordDialogContext);
}
