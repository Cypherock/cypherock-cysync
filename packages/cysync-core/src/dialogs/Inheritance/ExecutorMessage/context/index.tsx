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

export interface InheritanceExecutorMessageDialogContextInterface {
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

export const InheritanceExecutorMessageDialogContext: Context<InheritanceExecutorMessageDialogContextInterface> =
  createContext<InheritanceExecutorMessageDialogContextInterface>(
    {} as InheritanceExecutorMessageDialogContextInterface,
  );

export interface InheritanceExecutorMessageDialogContextProviderProps {
  children: ReactNode;
}

export const InheritanceExecutorMessageDialogProvider: FC<
  InheritanceExecutorMessageDialogContextProviderProps
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
    dialogName: 'inheritanceExecutorMessage',
  });

  const onClose = () => {
    dispatch(closeDialog('inheritanceExecutorMessage'));
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
    <InheritanceExecutorMessageDialogContext.Provider value={ctx}>
      {children}
    </InheritanceExecutorMessageDialogContext.Provider>
  );
};

export function useInheritanceExecutorMessageDialog(): InheritanceExecutorMessageDialogContextInterface {
  return useContext(InheritanceExecutorMessageDialogContext);
}
