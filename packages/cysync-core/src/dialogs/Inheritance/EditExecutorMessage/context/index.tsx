import React, {
  Context,
  Dispatch,
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import { ITabs, useAsync, useMemoReturn, useTabsAndDialogs } from '~/hooks';
import { closeDialog, useAppDispatch } from '~/store';

import { FetchData, EditMessage, Success } from '../Dialogs';
import { inheritanceEditPlansService } from '~/services';
import { useWalletAuth } from '../../hooks';

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
  resetFetchExecutorMessage: () => void;
  isUpdatingExecutorMessage: boolean;
  isUpdateExecutorMessageCompleted: boolean;
  resetUpdateExecutorMessage: () => void;
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
  const [unhandledError, setUnhandledError] = useState<any>();
  const [retryIndex, setRetryIndex] = useState(0);

  const onError = useCallback((e?: any) => {
    setUnhandledError(e);
  }, []);

  const { authTokens } = useWalletAuth(onError);

  const fetchData = useCallback(async () => {
    if (!authTokens?.accessToken) return false;
    const response = await inheritanceEditPlansService.fetchMessages(
      {
        executor: true,
        message: false,
        nominee: false,
        wallet: false,
      },
      authTokens?.accessToken,
    );
    if (response.error) throw response.error;
    setExecutorMessage(response?.result?.unencryptedData.data[0].message);
    return true;
  }, [setExecutorMessage]);

  const [
    fetchExecutorMessage,
    isFetchingExecutorMessage,
    isFetchExecutorMessageCompleted,
    resetFetchExecutorMessage,
  ] = useAsync(fetchData, onError);

  const updateData = useCallback(async () => {
    if (!executorMessage || !authTokens?.accessToken) return false;
    const response = await inheritanceEditPlansService.updateExecutorMessage(
      {
        executorMessage,
      },
      authTokens?.accessToken,
    );
    if (response.error) throw response.error;
    return true;
  }, [executorMessage]);

  const [
    updateExecutorMessage,
    isUpdatingExecutorMessage,
    isUpdateExecutorMessageCompleted,
    resetUpdateExecutorMessage,
  ] = useAsync(updateData, onError);

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

  const resetAll = useCallback(() => {
    setExecutorMessage(undefined);
    setRetryIndex(v => v + 1);
  }, []);

  const onRetry = useCallback(() => {
    resetAll();
    goTo(0, 0);
    setUnhandledError(undefined);
  }, [currentTab, currentDialog]);

  const ctx = useMemoReturn({
    onNext,
    onPrevious,
    tabs,
    onClose,
    goTo,
    currentTab,
    currentDialog,
    isDeviceRequired,
    unhandledError,
    onRetry,
    retryIndex,
    fetchExecutorMessage,
    updateExecutorMessage,
    executorMessage,
    setExecutorMessage,
    isFetchingExecutorMessage,
    isFetchExecutorMessageCompleted,
    resetFetchExecutorMessage,
    isUpdatingExecutorMessage,
    isUpdateExecutorMessageCompleted,
    resetUpdateExecutorMessage,
  });

  return (
    <InheritanceEditExecutorMessageDialogContext.Provider value={ctx}>
      {children}
    </InheritanceEditExecutorMessageDialogContext.Provider>
  );
};

export function useInheritanceEditExecutorMessageDialog(): InheritanceEditExecutorMessageDialogContextInterface {
  return useContext(InheritanceEditExecutorMessageDialogContext);
}
