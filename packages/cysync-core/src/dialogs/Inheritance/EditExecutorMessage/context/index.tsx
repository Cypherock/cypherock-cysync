import { assert } from '@cypherock/cysync-utils';
import React, {
  Context,
  FC,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

import { ITabs, useAsync, useMemoReturn, useTabsAndDialogs } from '~/hooks';
import { inheritanceEditPlansService } from '~/services';
import { inheritanceRecoverPlansService } from '~/services/inheritance/plan/recover';
import { AuthTokenConfig } from '~/services/utils';
import {
  closeDialog,
  IWalletAuthTokens,
  selectInheritanceSeedAuthTokens,
  updateWalletAuthTokens,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import {
  InheritanceEditExecutorMessageDialogContextInterface,
  InheritanceEditExecutorMessageDialogContextProviderProps,
  tabIndicies,
} from './types';

import { useSession } from '../../hooks';
import { FetchData, EditMessage, Success } from '../Dialogs';

export * from './types';

export const InheritanceEditExecutorMessageDialogContext: Context<InheritanceEditExecutorMessageDialogContextInterface> =
  createContext<InheritanceEditExecutorMessageDialogContextInterface>(
    {} as InheritanceEditExecutorMessageDialogContextInterface,
  );

export const InheritanceEditExecutorMessageDialogProvider: FC<
  InheritanceEditExecutorMessageDialogContextProviderProps
> = ({ children, walletId }) => {
  const dispatch = useAppDispatch();

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        [tabIndicies.fetchdata.tabNumber]: [
          tabIndicies.fetchdata.dialogs.fetchdata,
        ],
        [tabIndicies.editmessage.tabNumber]: [
          tabIndicies.editmessage.dialogs.editmessage,
        ],
      }),
      [],
    );

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

  const walletAuthTokens = useAppSelector(selectInheritanceSeedAuthTokens);
  const sessionService = useSession(onError);

  const fetchData = useCallback(async () => {
    let sessionId = await sessionService.getIsActive();
    const accessToken = walletAuthTokens[walletId]?.accessToken;
    const refreshToken = walletAuthTokens[walletId]?.refreshToken;

    if (!sessionId) {
      sessionId = await sessionService.start();
    }

    assert(sessionId, 'sessionId not found');
    assert(accessToken, 'accessToken not found');
    assert(refreshToken, 'refreshToken not found');

    const updateAuthToken = (token: string) => {
      const authTokens: IWalletAuthTokens = {
        accessToken: token,
        refreshToken,
      };

      updateWalletAuthTokens({ walletId, authTokens });
    };

    const authTokenConfig: AuthTokenConfig = {
      accessToken,
      refreshTokenConfig: {
        refreshToken,
        updateAuthToken,
      },
    };

    const response = await inheritanceRecoverPlansService.recover({
      authTokenConfig,
      sessionId,
      executor: true,
    });

    if (response.error) throw response.error;

    setExecutorMessage(response.result.executorMessage ?? '');
    return true;
  }, [
    sessionService.start,
    sessionService.getIsActive,
    walletAuthTokens[walletId],
  ]);

  const [
    fetchExecutorMessage,
    isFetchingExecutorMessage,
    isFetchExecutorMessageCompleted,
    resetFetchExecutorMessage,
  ] = useAsync(fetchData, onError);

  const updateData = useCallback(async () => {
    if (!executorMessage) return false;
    let sessionId = await sessionService.getIsActive();
    const accessToken = walletAuthTokens[walletId]?.accessToken;
    const refreshToken = walletAuthTokens[walletId]?.refreshToken;

    if (!sessionId) {
      sessionId = await sessionService.start();
    }

    assert(accessToken, 'accessToken not found');
    assert(sessionId, 'sessionId not found');
    assert(refreshToken, 'refreshToken not found');

    const updateAuthToken = (token: string) => {
      const authTokens: IWalletAuthTokens = {
        accessToken: token,
        refreshToken,
      };

      updateWalletAuthTokens({ walletId, authTokens });
    };

    const authTokenConfig: AuthTokenConfig = {
      accessToken,
      refreshTokenConfig: {
        refreshToken,
        updateAuthToken,
      },
    };

    const response = await inheritanceEditPlansService.updateExecutorMessage({
      authTokenConfig,
      sessionId,
      executorMessage,
    });
    if (response.error) throw response.error;
    return true;
  }, [executorMessage, walletAuthTokens[walletId]]);

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
    resetFetchExecutorMessage();
    resetUpdateExecutorMessage();
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
    isUpdatingExecutorMessage,
    isUpdateExecutorMessageCompleted,
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
