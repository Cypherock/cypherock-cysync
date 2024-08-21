import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
} from 'react';

import { ITabs, useTabsAndDialogs } from '~/hooks';
import { closeDialog, useAppDispatch } from '~/store';

import {
  Confirmation,
  EditMessage,
  ConfirmMessage,
  Decryption,
  Encryption,
  FetchData,
  Success,
} from '../Dialogs';

export interface InheritanceEditEncryptedMessageDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  unhandledError?: any;
}

export const InheritanceEditEncryptedMessageDialogContext: Context<InheritanceEditEncryptedMessageDialogContextInterface> =
  createContext<InheritanceEditEncryptedMessageDialogContextInterface>(
    {} as InheritanceEditEncryptedMessageDialogContextInterface,
  );

export interface InheritanceEditEncryptedMessageDialogContextProviderProps {
  children: ReactNode;
}

export const InheritanceEditEncryptedMessageDialogProvider: FC<
  InheritanceEditEncryptedMessageDialogContextProviderProps
> = ({ children }) => {
  const dispatch = useAppDispatch();

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};
  const tabs: ITabs = [
    { name: 'Confirmation', dialogs: [<Confirmation key="Confirmation" />] },
    { name: 'Fetch Data', dialogs: [<FetchData key="Fetch Data" />] },
    { name: 'Decryption', dialogs: [<Decryption key="Decryption" />] },
    { name: 'Edit Message', dialogs: [<EditMessage key="Edit Message" />] },
    {
      name: 'Confirm Message',
      dialogs: [<ConfirmMessage key="Confirm Message" />],
    },
    {
      name: 'Encryption',
      dialogs: [<Encryption key="Encryption" />],
    },
    {
      name: 'Success',
      dialogs: [<Success key="Success" />],
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
    dialogName: 'inheritanceEditEncryptedMessage',
  });

  const onClose = () => {
    dispatch(closeDialog('inheritanceEditEncryptedMessage'));
  };

  const ctx = useMemo(
    () => ({
      onNext,
      onPrevious,
      tabs,
      onClose,
      goTo,
      currentTab,
      currentDialog,
      isDeviceRequired,
    }),
    [
      onNext,
      onPrevious,
      tabs,
      onClose,
      goTo,
      currentTab,
      currentDialog,
      isDeviceRequired,
    ],
  );

  return (
    <InheritanceEditEncryptedMessageDialogContext.Provider value={ctx}>
      {children}
    </InheritanceEditEncryptedMessageDialogContext.Provider>
  );
};

export function useInheritanceEditEncryptedMessageDialog(): InheritanceEditEncryptedMessageDialogContextInterface {
  return useContext(InheritanceEditEncryptedMessageDialogContext);
}
