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
  useValidTillTimer,
} from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  selectUnHiddenAccounts,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { createCustomError, getDB, getKeyDB } from '~/utils';
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
  timer?: { minutes: string; seconds: string };
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
  [selectLanguage, selectWallets, selectUnHiddenAccounts],
  (lang, { wallets }, { accounts }) => ({
    lang,
    wallets,
    accounts,
  }),
);

export const TransactionActionDialogProvider: FC<
  TransactionActionDialogContextProviderProps
> = ({ children, selectedTransaction, transactionActionType }) => {
  const { lang, wallets, accounts } = useAppSelector(selector);
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
  // Releases the device lock of the running sign flow
  const releaseFlowLock = useRef<(() => void) | undefined>();
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
    // A prepared transaction with an expiry can't be reused, clear it so that
    // it is prepared again
    if (transactionRef.current?.computedData.preparedTransaction?.validTill) {
      setTransaction(undefined);
    }
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
        keyDB: getKeyDB(),
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
          keyDB: getKeyDB(),
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
      releaseFlowLock.current = onEnd;

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

  // Some instruments (eg. aSOL) must be broadcast within a short time of being
  // prepared, for which the server returns `validTill` with the prepared
  // transaction. Not needed once the transaction is signed.
  const validTill = signedTransaction
    ? undefined
    : transaction?.computedData.preparedTransaction?.validTill;

  const onTransactionExpired = () => {
    if (error || signedTransaction) return;

    logger.info('Canton choice transaction expired');
    // Stops listening to the device and aborts the sign flow on it
    cleanUp();
    releaseFlowLock.current?.();
    releaseFlowLock.current = undefined;
    setError(
      createCustomError(
        lang.strings.send.timeoutError.title,
        lang.strings.send.timeoutError.description,
      ),
    );
  };

  const { minutes: timerMinutes, seconds: timerSeconds } = useValidTillTimer(
    validTill,
    onTransactionExpired,
  );
  const timer = validTill
    ? { minutes: timerMinutes, seconds: timerSeconds }
    : undefined;

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
    timer,
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
