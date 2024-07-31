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

import { FetchData, EditMessage, Success } from '../Dialogs';

export interface InheritanceEditExecutorMessageDialogContextInterface {
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

export const InheritanceEditExecutorMessageDialogContext: Context<InheritanceEditExecutorMessageDialogContextInterface> =
  createContext<InheritanceEditExecutorMessageDialogContextInterface>(
    {} as InheritanceEditExecutorMessageDialogContextInterface,
  );

export interface InheritanceEditExecutorMessageDialogContextProviderProps {
  children: ReactNode;
}

export const InheritanceEditExecutorMessageDialogProvider: FC<
  InheritanceEditExecutorMessageDialogContextProviderProps
> = ({ children }) => {
  const dispatch = useAppDispatch();

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};
  const tabs: ITabs = [
    {
      name: 'Fetch Data',
      dialogs: [<FetchData key="FetchData" />],
    },
    {
      name: 'Edit Message',
      dialogs: [<EditMessage key="Edit Message" />],
    },
    {
      name: 'Success Message',
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
    dialogName: 'inheritanceEditExecutorMessage',
  });

  const onClose = () => {
    dispatch(closeDialog('inheritanceEditExecutorMessage'));
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
    <InheritanceEditExecutorMessageDialogContext.Provider value={ctx}>
      {children}
    </InheritanceEditExecutorMessageDialogContext.Provider>
  );
};

export function useInheritanceEditExecutorMessageDialog(): InheritanceEditExecutorMessageDialogContextInterface {
  return useContext(InheritanceEditExecutorMessageDialogContext);
}
