import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
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
  fetchData: () => void;
  updateData: (m: string) => void;
  executorMessage?: string;
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

  const [executorMessage, setExecutorMessage] = useState<string>();

  const fetchData = () => {
    'Implement this function';

    const dummy =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id  ullamcorper dui, sed vestibulum libero. Lorem ipsum dolor sit amet,  consectetur adipiscing elit. Sed placerat nibh sed justo sagittis  venenatis. Nullam dictum ipsum ac nunc aliquet, ut condimentum nibh  pharetra. Pellentesque interdum dignissim blandit. Nullam ac tincidunt  lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices  posuere cubilia curae; Vivamus magna velit, pulvinar euismod nisi non,  venenatis vehicula justo. Morbi ligula purus, condimentum vitae eleifend  ut, mattis at diam. Sed non pulvinar ex.';
    setExecutorMessage(dummy);
    setTimeout(() => {
      onNext();
    }, 2000);
  };

  const updateData = (message: string) => {
    'Implement this function';

    setExecutorMessage(message);
    setTimeout(() => {
      onNext();
    }, 2000);
  };

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
      fetchData,
      updateData,
      executorMessage,
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
      fetchData,
      updateData,
      executorMessage,
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
