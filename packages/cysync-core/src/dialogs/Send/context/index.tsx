// The ReactNodes won't be rendered as list so key is not required
/* eslint-disable react/jsx-key */
import { getCoinSupport } from '@cypherock/coin-support';
import { IPreparedBtcTransaction } from '@cypherock/coin-support-btc';
import { IPreparedEvmTransaction } from '@cypherock/coin-support-evm';
import {
  CoinSupport,
  IPreparedTransaction,
  ISignTransactionEvent,
} from '@cypherock/coin-support-interfaces';
import { IPreparedSolanaTransaction } from '@cypherock/coin-support-solana';
import {
  convertToUnit,
  formatDisplayAmount,
  formatDisplayPrice,
  getDefaultUnit,
  getZeroUnit,
} from '@cypherock/coin-support-utils';
import { CoinFamily } from '@cypherock/coins';
import { DropDownItemProps } from '@cypherock/cysync-ui';
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
import {
  WalletConnectCallRequestMethodMap,
  deviceLock,
  useDevice,
  useWalletConnect,
} from '~/context';
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
  walletDropdownList: DropDownItemProps[];
  handleWalletChange: () => void;
  selectedAccount: IAccount | undefined;
  selectedAccountParent: IAccount | undefined;
  setSelectedAccount: React.Dispatch<
    React.SetStateAction<IAccount | undefined>
  >;
  accountDropdownList: DropDownItemProps[];
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
  isAccountSelectionDisabled: boolean | undefined;
  getDefaultGasLimit: () => string;
  getComputedFee: (
    coinFamily: CoinFamily,
    txn?: IPreparedTransaction,
  ) => string;
}

export const SendDialogContext: Context<SendDialogContextInterface> =
  createContext<SendDialogContextInterface>({} as SendDialogContextInterface);

export interface SendDialogProps {
  walletId?: string;
  accountId?: string;
  txnData?: Record<string, string>;
  disableAccountSelection?: boolean;
  isWalletConnectRequest?: boolean;
}
export interface SendDialogContextProviderProps extends SendDialogProps {
  children: ReactNode;
}

export const SendDialogProvider: FC<SendDialogContextProviderProps> = ({
  children,
  walletId: defaultWalletId,
  accountId: defaultAccountId,
  txnData,
  disableAccountSelection,
  isWalletConnectRequest,
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
  const { connection } = useDevice();
  const flowSubscription = useRef<Subscription | undefined>();
  const { rejectCallRequest, approveCallRequest, callRequestData } =
    useWalletConnect();

  const {
    selectedWallet,
    setSelectedWallet,
    handleWalletChange,
    walletDropdownList,
  } = useWalletDropdown({
    walletId: defaultWalletId,
  });
  const {
    selectedAccount,
    setSelectedAccount,
    selectedAccountParent,
    handleAccountChange,
    accountDropdownList,
  } = useAccountDropdown({
    selectedWallet,
    defaultAccountId,
    includeSubAccounts: true,
  });

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
    if (disableAccountSelection) goTo(1, 0);
  }, []);

  useEffect(() => {
    if (signedTransaction) {
      if (
        !isWalletConnectRequest ||
        callRequestData?.method ===
          WalletConnectCallRequestMethodMap.ETH_SEND_TXN
      )
        broadcast();

      if (
        isWalletConnectRequest &&
        callRequestData?.method ===
          WalletConnectCallRequestMethodMap.ETH_SIGN_TXN
      ) {
        approveCallRequest(signedTransaction);
        onClose(true);
      }
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

  const onClose = async (skipRejection?: boolean) => {
    cleanUp();
    if (!skipRejection && isWalletConnectRequest) rejectCallRequest();
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

  const getCurrentCoinSupport = () => {
    if (!selectedAccount) throw new Error('No account selected');
    if (!coinSupport.current)
      coinSupport.current = getCoinSupport(selectedAccount.familyId);
    return coinSupport.current;
  };

  const broadcast = async () => {
    if (!transaction || !signedTransaction) {
      logger.warn('Transaction not ready');
      return;
    }

    try {
      const txn = await getCurrentCoinSupport().broadcastTransaction({
        db: getDB(),
        signedTransaction,
        transaction,
      });

      if (isWalletConnectRequest) {
        approveCallRequest(txn.hash);
        onClose(true);
        return;
      }
      setStoredTransaction(txn);
      setTransactionLink(
        getCurrentCoinSupport().getExplorerLink({ transaction: txn }),
      );
      onNext();
    } catch (e: any) {
      onError(e);
    }
  };

  const initialize = async () => {
    logger.info('Initializing send transaction');
    if (transaction !== undefined) return;

    try {
      const initTransaction =
        await getCurrentCoinSupport().initializeTransaction({
          db: getDB(),
          accountId: selectedAccount?.__id ?? '',
        });
      setTransaction(initTransaction);

      if (txnData) {
        const txn = initTransaction as IPreparedEvmTransaction;
        txn.userInputs.outputs.push({ address: '', amount: '0' });
        if (txnData.to) txn.userInputs.outputs[0].address = txnData.to;
        if (txnData.value) txn.userInputs.outputs[0].amount = txnData.value;
        if (txnData.data) txn.computedData.data = txnData.data;
        if (txnData.nonce) txn.userInputs.nonce = txnData.nonce;
        if (txnData.gasPrice) txn.userInputs.gasPrice = txnData.gasPrice;
        if (txnData.gasLimit) txn.userInputs.gasLimit = txnData.gasLimit;
        if (txnData.gas) txn.userInputs.gasLimit = txnData.gas;
        await prepare(txn);
      }
    } catch (e: any) {
      onError(e);
    }
  };

  const getDefaultGasLimit = () =>
    txnData?.gasLimit ??
    txnData?.gas ??
    (transaction as IPreparedEvmTransaction).computedData.gasLimitEstimate;

  const prepare = async (txn: IPreparedTransaction) => {
    logger.info('Preparing send transaction');

    try {
      const preparedTransaction =
        await getCurrentCoinSupport().prepareTransaction({
          accountId: selectedAccount?.__id ?? '',
          db: getDB(),
          txn,
        });

      setTransaction(structuredClone(preparedTransaction));
    } catch (e: any) {
      onError(e);
    }
  };

  const getFlowObserver = (
    onEnd: () => void,
  ): Observer<ISignTransactionEvent> => ({
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
    logger.info('Starting send transaction');

    if (!connection?.connection || !transaction) {
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
      flowSubscription.current = getCurrentCoinSupport()
        .signTransaction({
          connection: deviceConnection,
          db: getDB(),
          transaction,
        })
        .subscribe(getFlowObserver(onEnd));
    } catch (e) {
      onError(e);
    }
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
      coinId: selectedAccount.parentAssetId,
      assetId: selectedAccount.assetId,
      fromUnitAbbr:
        selectedAccount.unit ??
        getDefaultUnit(selectedAccount.parentAssetId, selectedAccount.assetId)
          .abbr,
      toUnitAbbr: getZeroUnit(
        selectedAccount.parentAssetId,
        selectedAccount.assetId,
      ).abbr,
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
      coinId: selectedAccount.parentAssetId,
      assetId: selectedAccount.assetId,
      toUnitAbbr:
        selectedAccount.unit ??
        getDefaultUnit(selectedAccount.parentAssetId, selectedAccount.assetId)
          .abbr,
      fromUnitAbbr: getZeroUnit(
        selectedAccount.parentAssetId,
        selectedAccount.assetId,
      ).abbr,
    });
    return formatDisplayAmount(convertedAmount.amount).complete;
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
    return invert
      ? formatDisplayAmount(result).complete
      : formatDisplayPrice(result);
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

  const getBitcoinFeeAmount = (txn: IPreparedTransaction | undefined) => {
    // return '0' in error scenarios because BigNumber cannot handle empty string
    if (!txn) return '0';
    const { computedData } = txn as IPreparedBtcTransaction;
    return computedData.fee.toString() || '0';
  };

  const getEvmFeeAmount = (txn: IPreparedTransaction | undefined) => {
    if (!txn) return '0';
    const { computedData } = txn as IPreparedEvmTransaction;
    return computedData.fee || '0';
  };

  const getSolanaFeeAmount = (txn: IPreparedTransaction | undefined) => {
    if (!txn) return '0';
    const { computedData } = txn as IPreparedSolanaTransaction;
    return computedData.fees || '0';
  };

  const computedFeeMap: Record<
    CoinFamily,
    (txn: IPreparedTransaction | undefined) => string
  > = {
    bitcoin: getBitcoinFeeAmount,
    evm: getEvmFeeAmount,
    near: () => '0',
    solana: getSolanaFeeAmount,
    starknet: () => '0',
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
      selectedAccountParent,
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
      isAccountSelectionDisabled: disableAccountSelection,
      getDefaultGasLimit,
      getComputedFee,
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
      selectedAccountParent,
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
      disableAccountSelection,
      getDefaultGasLimit,
      getComputedFee,
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

SendDialogProvider.defaultProps = {
  walletId: undefined,
  accountId: undefined,
  txnData: undefined,
  disableAccountSelection: undefined,
  isWalletConnectRequest: undefined,
};
