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

import { ConfirmPassword, RemovePasswordSuccess } from '../Dialogs';
import { useLockscreen } from '~/context';
import { validatePassword } from '~/utils';

export interface RemovePasswordDialogContextInterface {
  tabs: ITabs;
  isDeviceRequired: boolean;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  error: string | null;
  password: string;
  handlePasswordChange: (val: string) => void;
  loading: boolean;
  handleRemovePassword: () => Promise<void>;
}

export const RemovePasswordDialogContext: Context<RemovePasswordDialogContextInterface> =
  createContext<RemovePasswordDialogContextInterface>(
    {} as RemovePasswordDialogContextInterface,
  );

export interface RemovePasswordDialogProviderProps {
  children: ReactNode;
}

export const RemovePasswordDialogProvider: FC<
  RemovePasswordDialogProviderProps
> = ({ children }) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};

  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { setPassword: setCySyncPassword } = useLockscreen();

  const validateInputPassword = () => {
    const validation = validatePassword({ password, confirm: password }, lang);
    if (!validation.success) {
      setError(validation.error.errors[0].message);
      return;
    }
    setError(null);
  };
  useEffect(validateInputPassword, [password]);

  const handleRemovePassword = async () => {
    setLoading(true);
    const isCorrectPassword = await setCySyncPassword(undefined, password);

    if (!isCorrectPassword) {
      setError(lang.strings.lockscreen.incorrectPassword);
      setLoading(false);
      return;
    }

    setLoading(false);
    onNext();
  };

  const onClose = () => {
    dispatch(closeDialog('removePassword'));
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
  };

  const tabs: ITabs = [
    {
      name: lang.strings.dialogs.password.confimPassword.title,
      dialogs: [<ConfirmPassword key="remove-password-confirm" />],
    },
    {
      name: lang.strings.dialogs.password.success.remove,
      dialogs: [<RemovePasswordSuccess key="remove-password-success" />],
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
      password,
      handlePasswordChange,
      loading,
      handleRemovePassword,
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
      password,
      handlePasswordChange,
      loading,
      handleRemovePassword,
    ],
  );

  return (
    <RemovePasswordDialogContext.Provider value={ctx}>
      {children}
    </RemovePasswordDialogContext.Provider>
  );
};

export function useRemovePasswordDialog(): RemovePasswordDialogContextInterface {
  return useContext(RemovePasswordDialogContext);
}
