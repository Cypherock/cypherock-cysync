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

import { ConfirmPassword, RemovePasswordSuccess } from '../Dialogs';

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
  isLoading: boolean;
  isSubmitDisabled: boolean;
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
  const { setPassword: setCySyncPassword } = useLockscreen();
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};

  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState<boolean>(true);

  const validatePassword = () => {
    setError(null);
  };
  useEffect(validatePassword, [password]);

  const validateForm = () => {
    let isSubmitDisabledNew = Boolean(error);
    isSubmitDisabledNew ||= isLoading;
    isSubmitDisabledNew ||= password.length === 0;

    setIsSubmitDisabled(isSubmitDisabledNew);
  };

  useEffect(validateForm, [error, password, isLoading]);

  const handleRemovePassword = async () => {
    setIsLoading(true);
    const isCorrectPassword = await setCySyncPassword(undefined, password);

    if (!isCorrectPassword) {
      setError(lang.strings.lockscreen.incorrectPassword);
      setIsLoading(false);
      setIsSubmitDisabled(true);
      return;
    }

    setIsLoading(false);
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
      isLoading,
      handleRemovePassword,
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
      error,
      password,
      handlePasswordChange,
      isLoading,
      handleRemovePassword,
      isSubmitDisabled,
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
