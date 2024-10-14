import { Dispatch, ReactNode } from 'react';

import { ITabs } from '~/hooks';

export interface InheritanceEditExecutorMessageDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  onRetry: () => void;
  retryIndex: number;
  unhandledError?: any;
  fetchExecutorMessage: () => void;
  updateExecutorMessage: () => void;
  executorMessage?: string;
  setExecutorMessage: Dispatch<React.SetStateAction<string | undefined>>;
  isFetchingExecutorMessage: boolean;
  isFetchExecutorMessageCompleted: boolean;
  isUpdatingExecutorMessage: boolean;
  isUpdateExecutorMessageCompleted: boolean;
}

export interface InheritanceEditExecutorMessageDialogProps {
  walletId: string;
}

export interface InheritanceEditExecutorMessageDialogContextProviderProps
  extends InheritanceEditExecutorMessageDialogProps {
  children: ReactNode;
}

export const tabIndicies = {
  fetchdata: {
    tabNumber: 0,
    dialogs: {
      fetchdata: 0,
    },
  },
  editmessage: {
    tabNumber: 1,
    dialogs: {
      editmessage: 0,
    },
  },
  successmessage: {
    tabNumber: 2,
    dialogs: {
      successmessage: 0,
    },
  },
};
