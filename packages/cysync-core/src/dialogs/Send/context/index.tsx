// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import { getCoinSupport } from '@cypherock/coin-support';
import {
  CoinSupport,
  IPreparedTransaction,
  ISignTransactionEvent,
} from '@cypherock/coin-support-interfaces';
import {
  convertToUnit,
  formatDisplayAmount,
  getZeroUnit,
} from '@cypherock/coin-support-utils';
import { DropDownListItemProps } from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import { IAccount, ITransaction, IWallet } from '@cypherock/db-interfaces';
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
  useAccountDropdown,
  useTabsAndDialogs,
  useWalletDropdown,
} from '~/hooks';
import {
  closeDialog,
  selectLanguage,
  selectPriceInfos,
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
  storedTransaction: ITransaction | undefined;
  transactionLink: string | undefined;
  prepareAddressChanged: (val: string) => Promise<void>;
  prepareAmountChanged: (val: string) => Promise<void>;
  prepareSendMax: (state: boolean) => Promise<string>;
  priceConverter: (val: string, inverse?: boolean) => string;
  updateUserInputs: (count: number) => void;
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
  const { priceInfos } = useAppSelector(selectPriceInfos);
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {
    3: [0],
    4: [0],
  };

  const [error, setError] = useState<any | undefined>();
  const [signedTransaction, setSignedTransaction] = useState<
    string | undefined
  >();
  const [storedTransaction, setStoredTransaction] = useState<
    ITransaction | undefined
  >();
  const [transactionLink, setTransactionLink] = useState<string | undefined>();
  const [transaction, setTransaction] = useState<
    IPreparedTransaction | undefined
  >();

  const coinSupport = useRef<CoinSupport | undefined>();
  const [deviceEvents, setDeviceEvents] = useState<
    Record<number, boolean | undefined>
  >({});
  const { connection, connectDevice } = useDevice();
  const flowSubscription = useRef<Subscription | undefined>();

  const {
    selectedWallet,
    setSelectedWallet,
    handleWalletChange,
    walletDropdownList,
  } = useWalletDropdown();
  const {
    selectedAccount,
    setSelectedAccount,
    handleAccountChange,
    accountDropdownList,
  } = useAccountDropdown({ selectedWallet });

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
      dialogs: [<LoaderDialog />],
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
    }
  }, [signedTransaction]);

  useEffect(() => {
    resetInputStates();
  }, [selectedAccount, selectedWallet]);

  const resetStates = () => {
    setSignedTransaction(undefined);
    setStoredTransaction(undefined);
    setTransactionLink(undefined);
    setError(undefined);
    setDeviceEvents({});
  };

  const resetInputStates = () => {
    setTransaction(undefined);
    coinSupport.current = undefined;
  };

  const cleanUp = () => {
    if (flowSubscription.current) {
      flowSubscription.current.unsubscribe();
      flowSubscription.current = undefined;
    }
  };

  const onClose = () => {
    cleanUp();
    dispatch(closeDialog('sendDialog'));
  };

  const onRetry = () => {
    resetStates();
    goTo(1, 0);
  };

  const onError = (e?: any) => {
    cleanUp();
    setError(e);
  };

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

      setStoredTransaction(txn);
      setTransactionLink(
        coinSupport.current.getExplorerLink({ transaction: txn }),
      );
      onNext();
    } catch (e: any) {
      onError(e);
    }
  };

  const initialize = async () => {
    logger.info('Initializing send transaction');
    if (transaction !== undefined) return;

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

      setTransaction(preparedTransaction);
    } catch (e: any) {
      onError(e);
    }
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

    const deviceConnection = await connectDevice(connection.device);
    flowSubscription.current = coinSupport.current
      .signTransaction({
        connection: deviceConnection,
        db: getDB(),
        transaction,
      })
      .subscribe(getFlowObserver(onEnd));
  };

  const prepareAddressChanged = async (val: string) => {
    if (!transaction) return;
    const txn = transaction;
    if (txn.userInputs.outputs.length > 0)
      txn.userInputs.outputs[0].address = val;
    else
      txn.userInputs.outputs = [
        {
          address: val,
          amount: '',
        },
      ];
    await prepare(txn);
  };

  const prepareAmountChanged = async (value: string) => {
    if (!selectedAccount || !transaction) return;
    const convertedAmount = convertToUnit({
      amount: value,
      coinId: selectedAccount.assetId,
      fromUnitAbbr: selectedAccount.unit,
      toUnitAbbr: getZeroUnit(selectedAccount.assetId).abbr,
    });
    const txn = transaction;
    if (txn.userInputs.outputs.length > 0)
      txn.userInputs.outputs[0].amount = convertedAmount.amount;
    else
      txn.userInputs.outputs = [
        {
          address: '',
          amount: convertedAmount.amount,
        },
      ];
    await prepare(txn);
  };

  const prepareSendMax = async (state: boolean) => {
    if (!selectedAccount || !transaction) return '';
    const txn = transaction;
    txn.userInputs.isSendAll = state;
    await prepare(txn);
    const outputAmount = transaction.userInputs.outputs[0].amount;
    const convertedAmount = convertToUnit({
      amount: outputAmount,
      coinId: selectedAccount.assetId,
      toUnitAbbr: selectedAccount.unit,
      fromUnitAbbr: getZeroUnit(selectedAccount.assetId).abbr,
    });
    return formatDisplayAmount(convertedAmount.amount);
  };

  const priceConverter = (val: string, invert?: boolean) => {
    const coinPrice = priceInfos.find(
      p =>
        p.assetId === selectedAccount?.assetId &&
        p.currency.toLowerCase() === 'usd',
    );

    if (!coinPrice) return '';

    let result = new BigNumber(val);

    if (invert) result = result.dividedBy(coinPrice.latestPrice);
    else result = result.multipliedBy(coinPrice.latestPrice);

    if (result.isNaN()) return '';
    return result.toPrecision(2).toString();
  };

  const updateUserInputs = (count: number) => {
    if (!transaction) return;
    const txn = transaction;
    const { length } = txn.userInputs.outputs;
    if (length > count) {
      txn.userInputs.outputs.splice(count, 1);
    } else if (length < count) {
      for (let i = length; i < count; i += 1)
        txn.userInputs.outputs.push({
          address: '',
          amount: '',
        });
    }
    setTransaction(txn);
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
      storedTransaction,
      transactionLink,
      prepareAddressChanged,
      prepareAmountChanged,
      prepareSendMax,
      priceConverter,
      updateUserInputs,
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
      storedTransaction,
      transactionLink,
      prepareAddressChanged,
      prepareAmountChanged,
      prepareSendMax,
      priceConverter,
      updateUserInputs,
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
