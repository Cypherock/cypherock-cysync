// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import { getCoinSupport } from '@cypherock/coin-support';
import {
  CoinSupport,
  IPreparedTransaction,
  ISignTransactionEvent,
} from '@cypherock/coin-support-interfaces';
import { DropDownListItemProps } from '@cypherock/cysync-ui';
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
import { Observer } from 'rxjs';

import { GenericLoader } from '~/components';
import { deviceLock, useDevice } from '~/context';
import { ITabs, useAccountDropdown, useTabsAndDialogs } from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { getDB } from '~/utils';
import logger from '~/utils/logger';

import {
  SummaryDialog,
  Recipient,
  FinalMessage,
  SelectionDialog,
  DeviceAction,
} from '../Dialogs';

export interface SendDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  onClose: () => void;
  onRetry: () => void;
  error: any | undefined;
  currentTab: number;
  currentDialog: number;
  selectedWallet: IWallet | undefined;
  setSelectedWallet: React.Dispatch<React.SetStateAction<IWallet | undefined>>;
  walletDropdownList: DropDownListItemProps[];
  handleWalletChange: () => void;
  selectedAccount: IAccount | undefined;
  setSelectedAccount: React.Dispatch<
    React.SetStateAction<IAccount | undefined>
  >;
  accountDropdownList: DropDownListItemProps[];
  handleAccountChange: () => void;
  transaction: IPreparedTransaction | undefined;
  setTransaction: React.Dispatch<
    React.SetStateAction<IPreparedTransaction | undefined>
  >;
  initialize: () => Promise<void>;
  prepare: (txn: IPreparedTransaction) => Promise<void>;
  isDeviceRequired: boolean;
  deviceEvents: Record<number, boolean | undefined>;
  startFlow: () => Promise<void>;
  transactionHash: string | undefined;
  transactionLink: string | undefined;
}

export const SendDialogContext: Context<SendDialogContextInterface> =
  createContext<SendDialogContextInterface>({} as SendDialogContextInterface);

export interface SendDialogContextProviderProps {
  children: ReactNode;
}

export const SendDialogProvider: FC<SendDialogContextProviderProps> = ({
  children,
}) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {
    3: [0],
    4: [0],
    5: [0],
  };

  const [error, setError] = useState<any | undefined>();
  const [signedTransaction, setSignedTransaction] = useState<
    string | undefined
  >();
  const [transactionHash, setTransactionHash] = useState<string | undefined>();
  const [transactionLink, setTransactionLink] = useState<string | undefined>();
  const [transaction, setTransaction] = useState<
    IPreparedTransaction | undefined
  >();

  const coinSupport = useRef<CoinSupport | undefined>();
  const [deviceEvents, setDeviceEvents] = useState<
    Record<number, boolean | undefined>
  >({});
  const { connection, connectDevice } = useDevice();

  const {
    selectedWallet,
    setSelectedWallet,
    handleWalletChange,
    walletDropdownList,
    selectedAccount,
    setSelectedAccount,
    handleAccountChange,
    accountDropdownList,
  } = useAccountDropdown();

  const tabs: ITabs = [
    {
      name: lang.strings.send.aside.tabs.source,
      dialogs: [<SelectionDialog />],
    },
    {
      name: lang.strings.send.aside.tabs.recipient,
      dialogs: [<Recipient />],
    },
    {
      name: lang.strings.send.aside.tabs.summary,
      dialogs: [<SummaryDialog />],
    },
    {
      name: lang.strings.send.aside.tabs.x1vault,
      dialogs: [<DeviceAction />],
    },
    {
      name: lang.strings.send.aside.tabs.confirm,
      dialogs: [<GenericLoader />],
    },
    {
      name: '',
      dialogs: [<FinalMessage />],
      dontShowOnMilestone: true,
    },
  ];

  useEffect(() => {
    if (signedTransaction) {
      broadcast();
      console.log({ signedTransaction });
    }
  }, [signedTransaction]);

  const broadcast = async () => {
    if (!transaction || !signedTransaction) {
      logger.warn('Transaction not ready');
      return;
    }
    if (!coinSupport.current) {
      logger.warn('coinSupport not set');
      return;
    }

    try {
      const txn = await coinSupport.current.broadcastTransaction({
        db: getDB(),
        signedTransaction,
        transaction,
      });

      setTransactionHash(txn.hash);
      setTransactionLink(coinSupport.current.getTransactionLink(txn));
      onNext();
    } catch (e: any) {
      onError(e);
    }
  };
  const onClose = () => {
    dispatch(closeDialog('sendDialog'));
  };

  const onRetry = () => {
    console.log('Retried');
  };

  const initialize = async () => {
    logger.info('Initializing send transaction');

    if (!selectedAccount) {
      logger.warn('No account selected');
      return;
    }
    coinSupport.current = getCoinSupport(selectedAccount.familyId);

    try {
      const initTransaction = await coinSupport.current.initializeTransaction({
        db: getDB(),
        accountId: selectedAccount.__id ?? '',
      });
      setTransaction(initTransaction);
    } catch (e: any) {
      onError(e);
    }
  };

  const prepare = async (txn: IPreparedTransaction) => {
    logger.info('Preparing send transaction');

    if (!selectedAccount) {
      logger.warn('No account selected');
      return;
    }
    if (!coinSupport.current) {
      logger.warn('coinSupport not set');
      return;
    }

    try {
      const preparedTransaction = await coinSupport.current.prepareTransaction({
        accountId: selectedAccount.__id ?? '',
        db: getDB(),
        txn,
      });

      console.log({ txn, preparedTransaction });

      setTransaction(preparedTransaction);
    } catch (e: any) {
      onError(e);
    }
  };

  const onError = (e?: any) => {
    cleanUp();
    setError(e);
  };
  const cleanUp = () => {
    console.log('Function not implemented.');
  };

  const resetStates = () => {
    console.log('Function not implemented.');
  };

  const getFlowObserver = (
    onEnd: () => void,
  ): Observer<ISignTransactionEvent> => ({
    next: payload => {
      if (payload.device) {
        setDeviceEvents({ ...payload.device.events });
      }
      if (payload.transaction) {
        setSignedTransaction(payload.transaction);
      }

      console.log({ payload });
    },
    error: err => {
      onEnd();
      onError(err);
    },
    complete: () => {
      onEnd();
      cleanUp();
    },
  });

  const startFlow = async () => {
    logger.info('Starting send transaction');

    if (!selectedAccount) {
      logger.warn('No account selected');
      return;
    }
    if (!coinSupport.current) {
      logger.warn('coinSupport not set');
      return;
    }
    if (!connection || !transaction) {
      return;
    }

    resetStates();
    cleanUp();

    const taskId = lodash.uniqueId('task-');

    await deviceLock.acquire(connection.device, taskId);

    const onEnd = () => {
      deviceLock.release(connection.device, taskId);
    };

    console.log({ transaction });

    const deviceConnection = await connectDevice(connection.device);
    coinSupport.current
      .signTransaction({
        connection: deviceConnection,
        db: getDB(),
        transaction,
      })
      .subscribe(getFlowObserver(onEnd));
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
  });

  const ctx = useMemo(
    () => ({
      onNext,
      onPrevious,
      tabs,
      goTo,
      onClose,
      currentTab,
      currentDialog,
      isDeviceRequired,
      selectedWallet,
      setSelectedWallet,
      handleWalletChange,
      walletDropdownList,
      selectedAccount,
      setSelectedAccount,
      handleAccountChange,
      accountDropdownList,
      transaction,
      setTransaction,
      initialize,
      prepare,
      error,
      onRetry,
      deviceEvents,
      startFlow,
      transactionHash,
      transactionLink,
    }),
    [
      onNext,
      onPrevious,
      goTo,
      onClose,
      currentTab,
      currentDialog,
      isDeviceRequired,
      tabs,
      selectedWallet,
      setSelectedWallet,
      handleWalletChange,
      walletDropdownList,
      selectedAccount,
      setSelectedAccount,
      handleAccountChange,
      accountDropdownList,
      transaction,
      setTransaction,
      initialize,
      prepare,
      error,
      onRetry,
      deviceEvents,
      startFlow,
      transactionHash,
      transactionLink,
    ],
  );

  return (
    <SendDialogContext.Provider value={ctx}>
      {children}
    </SendDialogContext.Provider>
  );
};

export function useSendDialog(): SendDialogContextInterface {
  return useContext(SendDialogContext);
}
