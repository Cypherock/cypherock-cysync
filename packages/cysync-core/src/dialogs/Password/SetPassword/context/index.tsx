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

import { AddPassword, SetPasswordSuccess } from '../Dialogs';
import { useLockscreen } from '~/context';
import { validatePassword } from '~/utils';

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
  loading: boolean;
  handleSetPassword: () => Promise<void>;
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
  const [loading, setLoading] = useState<boolean>(false);

  const { setPassword: setCySyncPassword } = useLockscreen();

  const validateInputPassword = () => {
    const validation = validatePassword(
      { password: newPassword, confirm: confirmNewPassword },
      lang,
    );
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }
    setError(null);
  };
  useEffect(validateInputPassword, [newPassword, confirmNewPassword]);

  const handleSetPassword = async () => {
    setLoading(true);
    const isCorrectPassword = await setCySyncPassword(newPassword);

    if (!isCorrectPassword) {
      setError(lang.strings.dialogs.password.error.failedToSet);
      setLoading(false);
      return;
    }

    setLoading(false);
    onNext();
  };

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
      name: lang.strings.dialogs.password.createNewPassword.title,
      dialogs: [<AddPassword key="remove-password-confirm" />],
    },
    {
      name: lang.strings.dialogs.password.success.set,
      dialogs: [<SetPasswordSuccess key="remove-password-success" />],
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
      loading,
      handleSetPassword,
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
      loading,
      handleSetPassword,
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
