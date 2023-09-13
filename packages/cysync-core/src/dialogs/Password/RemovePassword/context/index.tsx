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

import { ConfirmPassword } from '../Dialogs';

export interface RemovePasswordDialogContextInterface {
  tabs: ITabs;
  isDeviceRequired: boolean;
  currentTab: number;
  currentDialog: number;
  onNext: () => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
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

  const onClose = () => {
    dispatch(closeDialog('removePassword'));
  };

  const tabs: ITabs = [
    {
      name: lang.strings.settings.tabs.app.title,
      dialogs: [<ConfirmPassword key="remove-password-confirm" />],
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
    <RemovePasswordDialogContext.Provider value={ctx}>
      {children}
    </RemovePasswordDialogContext.Provider>
  );
};

export function useRemovePasswordDialog(): RemovePasswordDialogContextInterface {
  return useContext(RemovePasswordDialogContext);
}
