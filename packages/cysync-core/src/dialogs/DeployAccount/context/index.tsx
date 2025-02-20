// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import { getCoinSupport } from '@cypherock/coin-support';
import {
  CoinSupport,
  IPreparedTransaction,
  ISignTransactionEvent,
} from '@cypherock/coin-support-interfaces';
import {
  IPreparedStarknetDeployAccountTransaction,
  IPreparedStarknetTransaction,
  StarknetSupport,
} from '@cypherock/coin-support-starknet';
import { CoinFamily } from '@cypherock/coins';
import { IAccount, ITransaction, IWallet } from '@cypherock/db-interfaces';
import lodash from 'lodash';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Observer, Subscription } from 'rxjs';

import { openSendDialog } from '~/actions';
import { LoaderDialog } from '~/components';
import { deviceLock, useDevice } from '~/context';
import { ITabs, useStateWithRef, useTabsAndDialogs } from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { getDB } from '~/utils';
import logger from '~/utils/logger';

import { SummaryDialog, FinalMessage, DeviceAction } from '../Dialogs';

export interface DeployAccountDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onSummaryDialogPrevious: () => void;
  onClose: () => void;
  onFinishDeployAccount: () => void;
  onRetry: () => void;
  error: any | undefined;
  currentTab: number;
  currentDialog: number;
  selectedWallet: IWallet | undefined;
  selectedAccount: IAccount | undefined;
  selectedAccountParent: IAccount | undefined;
  transaction: IPreparedTransaction | undefined;
  setTransaction: (txn: IPreparedTransaction) => void;
  prepare: () => Promise<void>;
  isDeviceRequired: boolean;
  deviceEvents: Record<number, boolean | undefined>;
  startFlow: () => Promise<void>;
  storedTransaction: ITransaction | undefined;
  transactionLink: string | undefined;
  getComputedFee: (
    coinFamily: CoinFamily,
    txn?: IPreparedTransaction,
  ) => string;
  defaultWalletId?: string;
  defaultAccountId?: string;
}

export const DeployAccountDialogContext: Context<DeployAccountDialogContextInterface> =
  createContext<DeployAccountDialogContextInterface>(
    {} as DeployAccountDialogContextInterface,
  );

export interface DeployAccountDialogProps {
  account: IAccount;
  parentAccount?: IAccount;
  wallet?: IWallet;
  sendTxnData?: Record<string, string>;
  isWalletConnectRequest?: boolean;
}

export interface DeployAccountDialogContextProviderProps
  extends DeployAccountDialogProps {
  children: ReactNode;
}

export const DeployAccountDialogProvider: FC<
  DeployAccountDialogContextProviderProps
> = ({
  children,
  wallet: selectedWallet,
  account: selectedAccount,
  parentAccount: selectedAccountParent,
  sendTxnData,
  isWalletConnectRequest,
}) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        1: [0],
        2: [0],
      }),
      [],
    );

  const [error, setError] = useState<any | undefined>();
  const [signedTransaction, setSignedTransaction] = useState<
    string | undefined
  >();
  const [storedTransaction, setStoredTransaction] = useState<
    ITransaction | undefined
  >();
  const [transactionLink, setTransactionLink] = useState<string | undefined>();
  const [transaction, setTransaction, transactionRef] = useStateWithRef<
    IPreparedTransaction | undefined
  >(undefined);

  const coinSupport = useRef<CoinSupport | undefined>();
  const [deviceEvents, setDeviceEvents] = useState<
    Record<number, boolean | undefined>
  >({});
  const { connection } = useDevice();
  const flowSubscription = useRef<Subscription | undefined>();

  const tabs: ITabs = useMemo(
    () => [
      {
        name: lang.strings.deployAccount.aside.tabs.summary,
        dialogs: [<SummaryDialog />],
      },
      {
        name: lang.strings.deployAccount.aside.tabs.x1vault,
        dialogs: [<DeviceAction />],
      },
      {
        name: lang.strings.deployAccount.aside.tabs.confirm,
        dialogs: [<LoaderDialog />],
      },
      {
        name: '',
        dialogs: [<FinalMessage />],
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
    setStoredTransaction(undefined);
    setTransactionLink(undefined);
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
    dispatch(closeDialog('deployAccountDialog'));
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
    if (!selectedAccount) throw new Error('No account selected');
    if (!coinSupport.current)
      coinSupport.current = getCoinSupport(selectedAccount.familyId);
    return coinSupport.current;
  };

  const broadcast = async () => {
    const txn = transactionRef.current;
    if (!txn || !signedTransaction) {
      logger.warn('Transaction not ready');
      return;
    }

    try {
      const storedTxn = await (
        getCurrentCoinSupport() as StarknetSupport
      ).broadcastDeployAccountTransaction({
        db: getDB(),
        signedTransaction,
        transaction: txn as IPreparedStarknetDeployAccountTransaction,
      });

      setStoredTransaction(storedTxn);
      setTransactionLink(
        getCurrentCoinSupport().getExplorerLink({ transaction: storedTxn }),
      );
      onNext();
    } catch (e: any) {
      onError(e);
    }
  };

  const prepare = async () => {
    logger.info('Preparing deploy account transaction');
    if (transaction !== undefined) return;

    try {
      const currentCoinSupport = getCurrentCoinSupport() as StarknetSupport;
      const preparedTransaction =
        await currentCoinSupport.prepareDeployAccountTransaction({
          db: getDB(),
          accountId: selectedAccount.__id ?? '',
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
    logger.info('Starting send transaction');

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
      flowSubscription.current = (getCurrentCoinSupport() as StarknetSupport)
        .signDeployAccountTransaction({
          connection: deviceConnection,
          db: getDB(),
          transaction: txn,
        })
        .subscribe(getFlowObserver(onEnd));
    } catch (e) {
      onError(e);
    }
  };

  const openSendDialogAndCloseSelf = useCallback(
    (skipAccountSelection = false) => {
      dispatch(
        openSendDialog({
          walletId: selectedWallet?.__id,
          accountId: selectedAccount.__id,
          txnData: sendTxnData,
          isWalletConnectRequest,
          skipAccountSelection,
        }),
      );
      onClose();
    },
    [selectedWallet, selectedAccount, sendTxnData, isWalletConnectRequest],
  );

  const onSummaryDialogPrevious = useCallback(() => {
    openSendDialogAndCloseSelf();
  }, [openSendDialogAndCloseSelf]);

  const onFinishDeployAccount = useCallback(() => {
    openSendDialogAndCloseSelf(true);
  }, [openSendDialogAndCloseSelf]);

  const getStarknetFeeAmount = (txn: IPreparedTransaction | undefined) => {
    if (!txn) return '0';
    const { computedData } = txn as IPreparedStarknetTransaction;
    return computedData.feeData.suggestedMaxFee || '0';
  };

  const computedFeeMap: Record<
    CoinFamily,
    (txn: IPreparedTransaction | undefined) => string
  > = {
    bitcoin: () => '0',
    evm: () => '0',
    near: () => '0',
    solana: () => '0',
    tron: () => '0',
    xrp: () => '0',
    starknet: getStarknetFeeAmount,
    icp: () => '0',
  };

  const getComputedFee = (coinFamily: CoinFamily, txn?: IPreparedTransaction) =>
    computedFeeMap[coinFamily](txn);

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
    dialogName: 'deployAccountDialog',
  });

  const ctx = useMemo(
    () => ({
      onNext,
      onPrevious,
      onSummaryDialogPrevious,
      tabs,
      goTo,
      onClose,
      onFinishDeployAccount,
      currentTab,
      currentDialog,
      isDeviceRequired,
      selectedWallet,
      selectedAccount,
      selectedAccountParent,
      transaction,
      transactionRef,
      setTransaction,
      prepare,
      error,
      onRetry,
      deviceEvents,
      startFlow,
      storedTransaction,
      transactionLink,
      getComputedFee,
    }),
    [
      onNext,
      onPrevious,
      onSummaryDialogPrevious,
      goTo,
      onClose,
      onFinishDeployAccount,
      currentTab,
      currentDialog,
      isDeviceRequired,
      tabs,
      selectedWallet,
      selectedAccount,
      selectedAccountParent,
      transaction,
      transactionRef,
      setTransaction,
      prepare,
      error,
      onRetry,
      deviceEvents,
      startFlow,
      storedTransaction,
      transactionLink,
      getComputedFee,
    ],
  );

  return (
    <DeployAccountDialogContext.Provider value={ctx}>
      {children}
    </DeployAccountDialogContext.Provider>
  );
};

export function useDeployAccountDialog(): DeployAccountDialogContextInterface {
  return useContext(DeployAccountDialogContext);
}

DeployAccountDialogProvider.defaultProps = {
  wallet: undefined,
  parentAccount: undefined,
  sendTxnData: undefined,
  isWalletConnectRequest: undefined,
};
