// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import { getCoinSupport } from '@cypherock/coin-support';
import {
  CantonSupport,
  IPreparedCantonMergeDelegationProposalTransaction,
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
import { getDB, getKeyDB } from '~/utils';
import logger from '~/utils/logger';

import {
  DeviceAction,
  SuccessDialogComponent,
  SummaryDialog,
} from '../Dialogs';

export interface EnableMergeDelegationDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  onFinishEnableMergeDelegation: () => void;
  onRetry: () => void;
  error: any | undefined;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  selectedWallet: IWallet | undefined;
  selectedAccount: IAccount | undefined;
  deviceEvents: Record<number, boolean | undefined>;
  transaction: IPreparedCantonMergeDelegationProposalTransaction | undefined;
  prepare: () => Promise<void>;
  startFlow: () => Promise<void>;
  isOnboarding?: boolean;
}

export const EnableMergeDelegationDialogContext: Context<EnableMergeDelegationDialogContextInterface> =
  createContext<EnableMergeDelegationDialogContextInterface>(
    {} as EnableMergeDelegationDialogContextInterface,
  );

export interface EnableMergeDelegationDialogProps {
  selectedAccount?: IAccount;
  selectedWallet?: IWallet;
  isOnboarding?: boolean;
}

export interface EnableMergeDelegationDialogContextProviderProps
  extends EnableMergeDelegationDialogProps {
  children: ReactNode;
}

export const EnableMergeDelegationDialogProvider: FC<
  EnableMergeDelegationDialogContextProviderProps
> = ({ children, selectedAccount, selectedWallet, isOnboarding }) => {
  const lang = useAppSelector(selectLanguage);
  const strings =
    lang.strings.dialogs.cantonDialogs.enableMergeDelegation.dialogs;
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
  const [transaction, setTransaction, transactionRef] = useStateWithRef<
    IPreparedCantonMergeDelegationProposalTransaction | undefined
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
        name: strings.summary.name,
        dialogs: [<SummaryDialog />],
      },
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
    dispatch(closeDialog('enableMergeDelegationDialog'));
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
      ).broadcastMergeDelegationProposalTransaction({
        db: getDB(),
        signedTransaction,
        transaction: txn,
        keyDB: getKeyDB(),
      });

      onNext();
    } catch (e: any) {
      onError(e);
    }
  };

  const prepare = async () => {
    logger.info('Preparing canton merge delegation proposal transaction');
    if (transaction !== undefined) return;

    try {
      const currentCoinSupport = getCurrentCoinSupport() as CantonSupport;
      const preparedTransaction =
        await currentCoinSupport.prepareMergeDelegationProposalTransaction({
          db: getDB(),
          accountId: selectedAccount?.__id ?? '',
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

  const onFinishEnableMergeDelegation = async () => {
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
    dialogName: 'enableMergeDelegationDialog',
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
    onFinishEnableMergeDelegation,
    selectedWallet,
    selectedAccount,
    deviceEvents,
    transaction,
    prepare,
    startFlow,
    isOnboarding,
  });

  return (
    <EnableMergeDelegationDialogContext.Provider value={ctx}>
      {children}
    </EnableMergeDelegationDialogContext.Provider>
  );
};

export function useEnableMergeDelegationDialog(): EnableMergeDelegationDialogContextInterface {
  return useContext(EnableMergeDelegationDialogContext);
}

EnableMergeDelegationDialogProvider.defaultProps = {
  selectedAccount: undefined,
  selectedWallet: undefined,
  isOnboarding: false,
};
