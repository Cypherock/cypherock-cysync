// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import { getCoinSupport } from '@cypherock/coin-support';
import {
  CantonSupport,
  IPreparedCantonExternalPartyTransaction,
} from '@cypherock/coin-support-canton';
import {
  CoinSupport,
  ISignTransactionEvent,
} from '@cypherock/coin-support-interfaces';
import { insertAccountIfNotExists } from '@cypherock/coin-support-utils';
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

import { syncAccounts, syncPriceHistories, syncPrices } from '~/actions';
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
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { getDB } from '~/utils';
import logger from '~/utils/logger';

import {
  DeviceAction,
  SuccessDialogComponent,
  AutomaticApprovalDialog,
} from '../Dialogs';

export interface CreateCantonAccountDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  onRetry: () => void;
  error: any | undefined;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  selectedAccount: IAccount | undefined;
  deviceEvents: Record<number, boolean | undefined>;
  selectedWallet: IWallet | undefined;
  transaction: IPreparedCantonExternalPartyTransaction | undefined;
  prepare: () => Promise<void>;
  startFlow: () => Promise<void>;
  addedAccount: IAccount | undefined;
}

export const CreateCantonAccountDialogContext: Context<CreateCantonAccountDialogContextInterface> =
  createContext<CreateCantonAccountDialogContextInterface>(
    {} as CreateCantonAccountDialogContextInterface,
  );

export interface CreateCantonAccountDialogProps {
  selectedAccount?: IAccount;
  selectedWallet?: IWallet;
}

export interface CreateCantonAccountDialogContextProviderProps
  extends CreateCantonAccountDialogProps {
  children: ReactNode;
}

export const CreateCantonAccountDialogProvider: FC<
  CreateCantonAccountDialogContextProviderProps
> = ({ children, selectedAccount, selectedWallet }) => {
  const lang = useAppSelector(selectLanguage);
  const strings =
    lang.strings.dialogs.cantonDialogs.createCantonAccount.dialogs;
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        0: [0],
        1: [0],
      }),
      [],
    );

  const [addedAccount, setAddedAccount] = useState<IAccount | undefined>();
  const [error, setError] = useState<any | undefined>();
  const [signedTransaction, setSignedTransaction] = useState<
    string | undefined
  >();
  const [transaction, setTransaction, transactionRef] = useStateWithRef<
    IPreparedCantonExternalPartyTransaction | undefined
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
      {
        name: strings.automaticApproval.name,
        dialogs: [<AutomaticApprovalDialog />],
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
    dispatch(closeDialog('createCantonAccountDialog'));
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

  const addSelectedAccount = async () => {
    if (!selectedAccount) return;

    try {
      const db = getDB();
      const response = await insertAccountIfNotExists(db, selectedAccount);
      setAddedAccount(response.account);

      if (response.isInserted) {
        dispatch(
          syncAccounts({
            accounts: [response.account],
            currency: currentCurrency,
          }),
        );

        syncPrices({
          families: [selectedAccount.familyId],
          currency: currentCurrency,
        });
        syncPriceHistories({
          families: [selectedAccount.familyId],
          currency: currentCurrency,
        });
      }
    } catch (e) {
      onError(e);
    }
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
      ).broadcastExternalPartyTransaction({
        db: getDB(),
        signedTransaction,
        transaction: txn,
      });

      await addSelectedAccount();
      onNext();
    } catch (e: any) {
      onError(e);
    }
  };

  const prepare = async () => {
    logger.info('Preparing canton external party transaction');
    if (transaction !== undefined) return;
    if (!selectedAccount) return;

    try {
      const currentCoinSupport = getCurrentCoinSupport() as CantonSupport;
      const preparedTransaction =
        await currentCoinSupport.prepareExternalPartyTransaction({
          account: selectedAccount,
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
    logger.info('Starting sign external party transaction');

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
        .signExternalPartyTransaction({
          connection: deviceConnection,
          db: getDB(),
          transaction: txn,
          account: selectedAccount,
        })
        .subscribe(getFlowObserver(onEnd));
    } catch (e) {
      onError(e);
    }
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
    dialogName: 'createCantonAccountDialog',
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
    selectedAccount,
    deviceEvents,
    selectedWallet,
    transaction,
    prepare,
    startFlow,
    addedAccount,
  });

  return (
    <CreateCantonAccountDialogContext.Provider value={ctx}>
      {children}
    </CreateCantonAccountDialogContext.Provider>
  );
};

export function useCreateCantonAccountDialog(): CreateCantonAccountDialogContextInterface {
  return useContext(CreateCantonAccountDialogContext);
}

CreateCantonAccountDialogProvider.defaultProps = {
  selectedAccount: undefined,
  selectedWallet: undefined,
};
