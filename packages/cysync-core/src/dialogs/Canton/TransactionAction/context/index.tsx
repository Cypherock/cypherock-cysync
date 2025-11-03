// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import { getCoinSupport } from '@cypherock/coin-support';
import {
  CantonSupport,
  ICantonTransactionChoice,
  IPreparedCantonTransaction,
} from '@cypherock/coin-support-canton';
import {
  CoinSupport,
  ISignTransactionEvent,
} from '@cypherock/coin-support-interfaces';
import { coinFamiliesMap } from '@cypherock/coins';
import { IAccount, ITransaction, IWallet } from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import lodash from 'lodash';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Observer, Subscription } from 'rxjs';

import { syncAccounts } from '~/actions';
import { LoaderDialog } from '~/components';
import { deviceLock, useCurrency, useDevice } from '~/context';
import {
  ITabs,
  useMemoReturn,
  useStateWithRef,
  useTabsAndDialogs,
} from '~/hooks';
import {
  closeDialog,
  selectCantonAuthTokens,
  selectLanguage,
  selectUnHiddenAccounts,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { getDB } from '~/utils';
import logger from '~/utils/logger';

import { DeviceAction, SuccessDialogComponent } from '../Dialogs';

export enum TransactionActionType {
  CANCEL = 'cancel',
  APPROVE = 'approve',
  REJECT = 'reject',
}

const transactionActionToChoiceMap: Record<
  TransactionActionType,
  ICantonTransactionChoice
> = {
  [TransactionActionType.CANCEL]: ICantonTransactionChoice.WITHDRAW,
  [TransactionActionType.APPROVE]: ICantonTransactionChoice.ACCEPT,
  [TransactionActionType.REJECT]: ICantonTransactionChoice.REJECT,
};

export interface TransactionActionDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  onFinishTransactionAction: () => void;
  onRetry: () => void;
  error: any | undefined;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  selectedWallet: IWallet | undefined;
  selectedAccount: IAccount | undefined;
  deviceEvents: Record<number, boolean | undefined>;
  transactionActionType: TransactionActionType;
  transaction: IPreparedCantonTransaction | undefined;
  prepare: () => Promise<void>;
  startFlow: () => Promise<void>;
}

export const TransactionActionDialogContext: Context<TransactionActionDialogContextInterface> =
  createContext<TransactionActionDialogContextInterface>(
    {} as TransactionActionDialogContextInterface,
  );

export interface TransactionActionDialogProps {
  selectedTransaction: ITransaction;
  transactionActionType: TransactionActionType;
}

export interface TransactionActionDialogContextProviderProps
  extends TransactionActionDialogProps {
  children: ReactNode;
}

const selector = createSelector(
  [
    selectLanguage,
    selectCantonAuthTokens,
    selectWallets,
    selectUnHiddenAccounts,
  ],
  (lang, cantonAuthTokens, { wallets }, { accounts }) => ({
    lang,
    cantonAuthTokens,
    wallets,
    accounts,
  }),
);

export const TransactionActionDialogProvider: FC<
  TransactionActionDialogContextProviderProps
> = ({ children, selectedTransaction, transactionActionType }) => {
  const { lang, cantonAuthTokens, wallets, accounts } =
    useAppSelector(selector);
  const strings = lang.strings.dialogs.cantonDialogs.transactionAction.dialogs;
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        0: [0],
        1: [0],
      }),
      [],
    );

  const selectedAccount = accounts.find(
    a => a.__id === selectedTransaction.accountId,
  );
  const selectedWallet = wallets.find(
    w => w.__id === selectedAccount?.walletId,
  );

  const [error, setError] = useState<any | undefined>();
  const [signedTransaction, setSignedTransaction] = useState<
    string | undefined
  >();
  const [transaction, setTransaction, transactionRef] = useStateWithRef<
    IPreparedCantonTransaction | undefined
  >(undefined);

  const coinSupport = useRef<CoinSupport | undefined>();

  const [deviceEvents, setDeviceEvents] = useState<
    Record<number, boolean | undefined>
  >({});
  const { connection } = useDevice();
  const flowSubscription = useRef<Subscription | undefined>();
  const { currentCurrency } = useCurrency();

  const tabs: ITabs = useMemo(
    () => [
      {
        name: strings.x1Vault.name,
        dialogs: [<DeviceAction />],
      },
      {
        name: strings.confirmation.name,
        dialogs: [<LoaderDialog />],
      },
      {
        name: '',
        dialogs: [<SuccessDialogComponent />],
        dontShowOnMilestone: true,
      },
    ],
    [lang],
  );

  useEffect(() => {
    if (signedTransaction) {
      broadcast();
    }
  }, [signedTransaction]);

  const resetStates = () => {
    setSignedTransaction(undefined);
    setError(undefined);
    setDeviceEvents({});
  };

  const cleanUp = () => {
    if (flowSubscription.current) {
      flowSubscription.current.unsubscribe();
      flowSubscription.current = undefined;
    }
  };

  const onClose = async () => {
    cleanUp();
    dispatch(closeDialog('transactionActionDialog'));
  };

  const onRetry = () => {
    resetStates();
    goTo(0, 0);
  };

  const onError = (e?: any) => {
    cleanUp();
    setError(e);
  };

  const getCurrentCoinSupport = () => {
    if (!coinSupport.current)
      coinSupport.current = getCoinSupport(coinFamiliesMap.canton);
    return coinSupport.current;
  };

  const broadcast = async () => {
    const txn = transactionRef.current;
    if (!txn || !signedTransaction) {
      logger.warn('Transaction not ready');
      return;
    }

    try {
      await (
        getCurrentCoinSupport() as CantonSupport
      ).broadcastChoiceTransaction({
        db: getDB(),
        signedTransaction,
        transaction: txn,
        accessToken: cantonAuthTokens?.accessToken ?? '',
      });

      onNext();
      dispatch(
        syncAccounts({
          accounts: selectedAccount ? [selectedAccount] : [],
          currency: currentCurrency,
        }),
      );
    } catch (e: any) {
      onError(e);
    }
  };

  const prepare = async () => {
    logger.info('Preparing canton choice transaction');
    if (transaction !== undefined) return;

    try {
      const currentCoinSupport = getCurrentCoinSupport() as CantonSupport;
      const preparedTransaction =
        await currentCoinSupport.prepareChoiceTransaction({
          db: getDB(),
          txn: selectedTransaction,
          choice: transactionActionToChoiceMap[transactionActionType],
          accessToken: cantonAuthTokens?.accessToken ?? '',
        });
      setTransaction(preparedTransaction);
    } catch (e: any) {
      onError(e);
    }
  };

  const getFlowObserver = (
    onEnd: () => void,
  ): Observer<ISignTransactionEvent<any>> => ({
    next: payload => {
      if (payload.device) setDeviceEvents({ ...payload.device.events });
      if (payload.transaction) setSignedTransaction(payload.transaction);
    },
    error: err => {
      onEnd();
      onError(err);
    },
    complete: () => {
      cleanUp();
      onEnd();
    },
  });

  const startFlow = async () => {
    const txn = transactionRef.current;
    logger.info('Starting sign transaction');

    if (!connection?.connection || !txn) {
      return;
    }

    try {
      resetStates();
      cleanUp();

      const taskId = lodash.uniqueId('task-');

      await deviceLock.acquire(connection.device, taskId);

      const onEnd = () => {
        deviceLock.release(connection.device, taskId);
      };

      const deviceConnection = connection.connection;
      flowSubscription.current = (getCurrentCoinSupport() as CantonSupport)
        .signTransaction({
          connection: deviceConnection,
          db: getDB(),
          transaction: txn,
        })
        .subscribe(getFlowObserver(onEnd));
    } catch (e) {
      onError(e);
    }
  };

  const onFinishTransactionAction = async () => {
    onClose();
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
    dialogName: 'transactionActionDialog',
  });

  const ctx = useMemoReturn({
    onNext,
    onPrevious,
    tabs,
    goTo,
    onClose,
    currentTab,
    currentDialog,
    isDeviceRequired,
    error,
    onRetry,
    onFinishTransactionAction,
    selectedWallet,
    selectedAccount,
    deviceEvents,
    transactionActionType,
    transaction,
    prepare,
    startFlow,
  });

  return (
    <TransactionActionDialogContext.Provider value={ctx}>
      {children}
    </TransactionActionDialogContext.Provider>
  );
};

export function useTransactionActionDialog(): TransactionActionDialogContextInterface {
  return useContext(TransactionActionDialogContext);
}
