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

import { useLockscreen } from '~/context';
import { ITabs, useTabsAndDialogs } from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { validatePassword } from '~/utils';
import logger from '~/utils/logger';

import { ChangePasswordSuccess, CreateNewPassword } from '../Dialogs';

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
  handleChangePassword: () => Promise<void>;
  isLoading: boolean;
  isSubmitDisabled: boolean;
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
  const { setPassword: setCySyncPassword } = useLockscreen();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(() => ({}), []);

  const [error, setError] = useState<string | null>(null);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

  useEffect(() => {
    if (oldPassword === newPassword || oldPassword === confirmNewPassword) {
      setError(lang.strings.lockscreen.sameOldAndNewPassword);
      return;
    }

    const _password = newPassword || confirmNewPassword || null;
    const _confirm = confirmNewPassword || newPassword || null;

    if (_password && _confirm) {
      const validation = validatePassword(
        { password: _password, confirm: _confirm },
        lang,
      );
      if (!validation.success) {
        setError(validation.error.errors[0].message);
        return;
      }
    }

    setError(null);
  }, [oldPassword, newPassword, confirmNewPassword]);

  const validateForm = () => {
    let isSubmitDisabledNew = Boolean(error);
    isSubmitDisabledNew ||= isLoading;
    isSubmitDisabledNew ||= oldPassword.length === 0;
    isSubmitDisabledNew ||= newPassword.length === 0;
    isSubmitDisabledNew ||= confirmNewPassword.length === 0;

    setIsSubmitDisabled(isSubmitDisabledNew);
  };

  useEffect(validateForm, [
    error,
    isLoading,
    oldPassword,
    newPassword,
    confirmNewPassword,
  ]);

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

  const handleChangePassword = async () => {
    setIsLoading(true);
    const isPasswordCorrect = await setCySyncPassword(newPassword, oldPassword);

    logger.info('Form Submit: Change Password', {
      source: ChangePasswordDialogProvider.name,
      isPasswordCorrect,
    });

    if (!isPasswordCorrect) {
      setError(lang.strings.lockscreen.incorrectPassword);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    onNext();
  };

  const tabs: ITabs = useMemo(
    () => [
      {
        name: lang.strings.dialogs.password.confimPassword.title,
        dialogs: [<CreateNewPassword key="change-password-create-new" />],
      },
      {
        name: lang.strings.dialogs.password.success.change,
        dialogs: [<ChangePasswordSuccess key="change-password-success" />],
      },
    ],
    [lang],
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
    dialogName: 'changePassword',
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
      handleChangePassword,
      isLoading,
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
      oldPassword,
      newPassword,
      confirmNewPassword,
      handleOldPasswordChange,
      handleNewPasswordChange,
      handleConfirmNewPasswordChange,
      error,
      handleChangePassword,
      isLoading,
      isSubmitDisabled,
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
