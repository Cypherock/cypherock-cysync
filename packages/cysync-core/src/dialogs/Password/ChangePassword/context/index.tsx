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

  const onClose = () => {
    dispatch(closeDialog('changePassword'));
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
    <ChangePasswordDialogContext.Provider value={ctx}>
      {children}
    </ChangePasswordDialogContext.Provider>
  );
};

export function useChangePasswordDialog(): ChangePasswordDialogContextInterface {
  return useContext(ChangePasswordDialogContext);
}
