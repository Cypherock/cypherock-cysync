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

import { FetchData, ReminderSetup, Success } from '../Dialogs';

export interface InheritanceEditReminderTimeDialogContextInterface {
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
  updateData: (n: number) => void;
  reminder?: number;
}

export const InheritanceEditReminderTimeDialogContext: Context<InheritanceEditReminderTimeDialogContextInterface> =
  createContext<InheritanceEditReminderTimeDialogContextInterface>(
    {} as InheritanceEditReminderTimeDialogContextInterface,
  );

export interface InheritanceEditReminderTimeDialogContextProviderProps {
  children: ReactNode;
}

export const InheritanceEditReminderTimeDialogProvider: FC<
  InheritanceEditReminderTimeDialogContextProviderProps
> = ({ children }) => {
  const dispatch = useAppDispatch();

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};
  const tabs: ITabs = [
    {
      name: 'Fetch Data',
      dialogs: [<FetchData key="FetchData" />],
    },
    {
      name: 'Reminder Setup',
      dialogs: [<ReminderSetup key="ReminderSetup" />],
    },
    {
      name: 'Success Message',
      dialogs: [<Success key="Success" />],
    },
  ];

  const [reminder, setReminder] = useState<number>();

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
    dialogName: 'inheritanceEditReminderTime',
  });

  const onClose = () => {
    dispatch(closeDialog('inheritanceEditReminderTime'));
  };

  const fetchData = () => {
    'Implement this function';

    setReminder(1);
    setTimeout(() => {
      onNext();
    }, 2000);
  };

  const updateData = (newDuration: number) => {
    'Implement this function';

    setReminder(newDuration);
    setTimeout(() => {
      onNext();
    }, 2000);
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
      reminder,
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
      reminder,
    ],
  );

  return (
    <InheritanceEditReminderTimeDialogContext.Provider value={ctx}>
      {children}
    </InheritanceEditReminderTimeDialogContext.Provider>
  );
};

export function useInheritanceEditReminderTimeDialog(): InheritanceEditReminderTimeDialogContextInterface {
  return useContext(InheritanceEditReminderTimeDialogContext);
}
