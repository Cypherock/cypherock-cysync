// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import { getCoinSupport } from '@cypherock/coin-support';
import {
  CantonSupport,
  IPreparedCantonTransferPreApprovalTransaction,
} from '@cypherock/coin-support-canton';
import {
  CoinSupport,
  ISignTransactionEvent,
} from '@cypherock/coin-support-interfaces';
import { coinFamiliesMap } from '@cypherock/coins';
import { IAccount, IWallet } from '@cypherock/db-interfaces';
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

import { LoaderDialog } from '~/components';
import { deviceLock, useDevice } from '~/context';
import {
  ITabs,
  useMemoReturn,
  useStateWithRef,
  useTabsAndDialogs,
} from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { getDB, keyValueStore } from '~/utils';
import logger from '~/utils/logger';

import { DeviceAction, SuccessDialogComponent } from '../Dialogs';

export interface EnableApprovalDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  onFinishEnableApproval: () => void;
  onRetry: () => void;
  error: any | undefined;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  selectedWallet: IWallet | undefined;
  selectedAccount: IAccount | undefined;
  deviceEvents: Record<number, boolean | undefined>;
  transaction: IPreparedCantonTransferPreApprovalTransaction | undefined;
  prepare: () => Promise<void>;
  startFlow: () => Promise<void>;
}

export const EnableApprovalDialogContext: Context<EnableApprovalDialogContextInterface> =
  createContext<EnableApprovalDialogContextInterface>(
    {} as EnableApprovalDialogContextInterface,
  );

export interface EnableApprovalDialogProps {
  selectedAccount?: IAccount;
  selectedWallet?: IWallet;
}

export interface EnableApprovalDialogContextProviderProps
  extends EnableApprovalDialogProps {
  children: ReactNode;
}

export const EnableApprovalDialogProvider: FC<
  EnableApprovalDialogContextProviderProps
> = ({ children, selectedAccount, selectedWallet }) => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.dialogs.cantonDialogs.enableApproval.dialogs;
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        0: [0],
        1: [0],
      }),
      [],
    );

  const [error, setError] = useState<any | undefined>();
  const [signedTransaction, setSignedTransaction] = useState<
    string | undefined
  >();
  const [transaction, setTransaction, transactionRef] = useStateWithRef<
    IPreparedCantonTransferPreApprovalTransaction | undefined
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
    dispatch(closeDialog('enableApprovalDialog'));
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
      ).broadcastTransferPreApprovalTransaction({
        db: getDB(),
        signedTransaction,
        transaction: txn,
      });

      onNext();
    } catch (e: any) {
      onError(e);
    }
  };

  const prepare = async () => {
    logger.info('Preparing canton transferPreApproval transaction');
    if (transaction !== undefined) return;

    try {
      const currentCoinSupport = getCurrentCoinSupport() as CantonSupport;
      const preparedTransaction =
        await currentCoinSupport.prepareTransferPreApprovalTransaction({
          db: getDB(),
          accountId: selectedAccount?.__id ?? '',
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

  const onFinishEnableApproval = async () => {
    keyValueStore.isAutomaticApprovalsEnabled.set(true);
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
    dialogName: 'enableApprovalDialog',
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
    onFinishEnableApproval,
    selectedWallet,
    selectedAccount,
    deviceEvents,
    transaction,
    prepare,
    startFlow,
  });

  return (
    <EnableApprovalDialogContext.Provider value={ctx}>
      {children}
    </EnableApprovalDialogContext.Provider>
  );
};

export function useEnableApprovalDialog(): EnableApprovalDialogContextInterface {
  return useContext(EnableApprovalDialogContext);
}

EnableApprovalDialogProvider.defaultProps = {
  selectedAccount: undefined,
  selectedWallet: undefined,
};
