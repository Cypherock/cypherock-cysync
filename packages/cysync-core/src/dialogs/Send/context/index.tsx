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
  IPreparedStarknetTransaction,
  StarknetSupport,
} from '@cypherock/coin-support-starknet';
import { IPreparedTronTransaction } from '@cypherock/coin-support-tron';
import {
  convertToUnit,
  formatDisplayAmount,
  formatDisplayPrice,
  getDefaultUnit,
  getParsedAmount,
  getZeroUnit,
} from '@cypherock/coin-support-utils';
import { IPreparedXrpTransaction } from '@cypherock/coin-support-xrp';
import { coinFamiliesMap, CoinFamily } from '@cypherock/coins';
import { ServerError, ServerErrorType } from '@cypherock/cysync-core-constants';
import { DropDownItemProps, parseLangTemplate } from '@cypherock/cysync-ui';
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
  useCallback,
} from 'react';
import { Observer, Subscription } from 'rxjs';

import { openDeployAccountDialog } from '~/actions';
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
  useStateWithRef,
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
  source: SendFlowSource;
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  onSelectionDialogNext: () => void;
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
  handleWalletChange: (id?: string | undefined) => void;
  selectedAccount: IAccount | undefined;
  selectedAccountParent: IAccount | undefined;
  setSelectedAccount: React.Dispatch<
    React.SetStateAction<IAccount | undefined>
  >;
  accountDropdownList: DropDownItemProps[];
  handleAccountChange: (id?: string | undefined) => void;
  transaction: IPreparedTransaction | undefined;
  transactionRef: React.MutableRefObject<IPreparedTransaction | undefined>;
  setTransaction: (txn: IPreparedTransaction) => void;
  initialize: () => Promise<void>;
  prepare: (txn: IPreparedTransaction) => Promise<void>;
  isDeviceRequired: boolean;
  deviceEvents: Record<number, boolean | undefined>;
  startFlow: () => Promise<void>;
  storedTransaction: ITransaction | undefined;
  transactionLink: string | undefined;
  prepareAddressChanged: (val: string) => Promise<void>;
  prepareAmountChanged: (val: string) => Promise<void>;
  prepareTransactionRemarks: (val: string) => Promise<void>;
  prepareSendMax: (state: boolean) => Promise<string>;
  prepareDestinationTag: (tag: number) => Promise<void>;
  priceConverter: (val: string, inverse?: boolean) => string;
  updateUserInputs: (count: number) => void;
  isAccountSelectionDisabled: boolean | undefined;
  getDefaultGasLimit: () => string;
  getComputedFee: (
    coinFamily: CoinFamily,
    txn?: IPreparedTransaction,
  ) => string;
  defaultWalletId?: string;
  defaultAccountId?: string;
  getOutputError: (index: number) => string;
  getAmountError: () => string;
  getDestinationTagError: () => string;
  isPreparingTxn: boolean;
}

export const SendDialogContext: Context<SendDialogContextInterface> =
  createContext<SendDialogContextInterface>({} as SendDialogContextInterface);

export interface ToDetails {
  address: string;
  amount: string;
  extraInput?: string;
}

export type SendFlowSource = 'default' | 'swap';

export interface SendDialogProps {
  walletId?: string;
  accountId?: string;
  txnData?: Record<string, string>;
  prefillDetails?: Partial<ToDetails>;
  disableAccountSelection?: boolean;
  isWalletConnectRequest?: boolean;
  skipAccountSelection?: boolean;
  storeTransactionId?: (id: string) => void;
  onClose?: () => void;
  source?: SendFlowSource;
}

export interface SendDialogContextProviderProps extends SendDialogProps {
  children: ReactNode;
}

export const SendDialogProvider: FC<SendDialogContextProviderProps> = ({
  children,
  walletId: defaultWalletId,
  accountId: defaultAccountId,
  txnData,
  prefillDetails,
  disableAccountSelection,
  isWalletConnectRequest,
  skipAccountSelection,
  storeTransactionId,
  onClose: injectedOnClose,
  source = 'default',
}) => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const { priceInfos } = useAppSelector(selectPriceInfos);
  const deviceRequiredDialogsMap: Record<number, number[] | undefined> =
    useMemo(
      () => ({
        3: [0],
        4: [0],
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

  const tabs: ITabs = useMemo(() => {
    const allTabs = [
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
    if (source === 'swap') {
      return allTabs.filter(
        t => t.name !== lang.strings.send.aside.tabs.summary,
      );
    }
    return allTabs;
  }, [lang]);

  useEffect(() => {
    if (disableAccountSelection || skipAccountSelection) goTo(1, 0);
  }, []);

  if (storeTransactionId) {
    useEffect(() => {
      if (storedTransaction?.__id) {
        storeTransactionId(storedTransaction.__id);
      }
    }, [storedTransaction]);
  }

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
  }, [selectedAccount?.__id, selectedWallet?.__id]);

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
    if (injectedOnClose) injectedOnClose();
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
    const txn = transactionRef.current;
    if (!txn || !signedTransaction) {
      logger.warn('Transaction not ready');
      return;
    }

    try {
      const storedTxn = await getCurrentCoinSupport().broadcastTransaction({
        db: getDB(),
        signedTransaction,
        transaction: txn,
      });

      if (isWalletConnectRequest) {
        approveCallRequest(storedTxn.hash);
        onClose(true);
        return;
      }
      setStoredTransaction(storedTxn);
      setTransactionLink(
        getCurrentCoinSupport().getExplorerLink({ transaction: storedTxn }),
      );
      onNext();
    } catch (e: any) {
      logger.error(JSON.stringify(e));

      const broadcastError = new ServerError(
        ServerErrorType.TRANSACTION_BROADCAST_FAILED,
        undefined,
        {
          advanceText: e?.message,
        },
      );
      onError(broadcastError);
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
      if (prefillDetails) {
        initTransaction.userInputs.outputs.push({
          address: '',
          amount: '',
          remarks: '',
        });
        if (prefillDetails.address)
          initTransaction.userInputs.outputs[0].address =
            prefillDetails.address;
        if (prefillDetails.amount && selectedAccount) {
          const convertedAmount = convertToUnit({
            amount: prefillDetails.amount,
            coinId: selectedAccount.parentAssetId,
            assetId: selectedAccount.assetId,
            fromUnitAbbr:
              selectedAccount.unit ??
              getDefaultUnit(
                selectedAccount.parentAssetId,
                selectedAccount.assetId,
              ).abbr,
            toUnitAbbr: getZeroUnit(
              selectedAccount.parentAssetId,
              selectedAccount.assetId,
            ).abbr,
          });
          initTransaction.userInputs.outputs[0].amount = convertedAmount.amount;
        }
        if (prefillDetails.extraInput) {
          initTransaction.userInputs = fillExtraInput(
            selectedAccount?.familyId as CoinFamily,
            initTransaction,
            prefillDetails.extraInput ?? '',
          );
        }
      }
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
        if (txnData.remarks)
          txn.userInputs.outputs[0].remarks = txnData.remarks;
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

  const [isPreparingTxn, setPreparingTxn] = useState(false);
  const prepare = async (txn: IPreparedTransaction) => {
    logger.info('Preparing send transaction');

    try {
      setPreparingTxn(true);
      const preparedTransaction =
        await getCurrentCoinSupport().prepareTransaction({
          accountId: selectedAccount?.__id ?? '',
          db: getDB(),
          txn,
        });

      setTransaction(structuredClone(preparedTransaction));
    } catch (e: any) {
      onError(e);
    } finally {
      setPreparingTxn(false);
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
      flowSubscription.current = getCurrentCoinSupport()
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

  const prepareAddressChanged = async (val: string) => {
    const txn = transactionRef.current;
    if (!txn) return;
    if (txn.userInputs.outputs.length > 0)
      txn.userInputs.outputs[0].address = val;
    else
      txn.userInputs.outputs = [
        {
          address: val,
          amount: '',
          remarks: '',
        },
      ];
    await prepare(txn);
  };

  const prepareAmountChanged = async (value: string) => {
    const txn = transactionRef.current;
    if (!selectedAccount || !txn) return;
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
    if (txn.userInputs.outputs.length > 0)
      txn.userInputs.outputs[0].amount = convertedAmount.amount;
    else
      txn.userInputs.outputs = [
        {
          address: '',
          amount: convertedAmount.amount,
          remarks: '',
        },
      ];
    await prepare(txn);
  };

  const prepareTransactionRemarks = async (remark: string) => {
    const txn = transactionRef.current;
    if (!txn) return;

    const trimmedRemark = remark.trim();

    if (txn.userInputs.outputs.length > 0) {
      txn.userInputs.outputs[0].remarks = trimmedRemark;
    } else {
      txn.userInputs.outputs = [
        {
          address: '',
          amount: '',
          remarks: trimmedRemark,
        },
      ];
    }
    setTransaction(structuredClone(txn));
  };

  const prepareSendMax = async (state: boolean) => {
    const txn = transactionRef.current;
    if (!selectedAccount || !txn) return '';
    txn.userInputs.isSendAll = state;
    await prepare(txn);
    const outputAmount = txn.userInputs.outputs[0].amount;
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

  const prepareDestinationTag = async (tag: number) => {
    const txn = transactionRef.current as IPreparedXrpTransaction;
    if (!txn) return;

    const valueToSet = tag < 0 ? undefined : tag;
    if (txn.userInputs.outputs.length > 0) {
      txn.userInputs.outputs[0].destinationTag = valueToSet;
    } else {
      txn.userInputs.outputs = [
        {
          address: '',
          amount: '',
          destinationTag: valueToSet,
        },
      ];
    }
    await prepare(txn);
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
    const txn = transactionRef.current;
    if (!txn) return;
    const { length } = txn.userInputs.outputs;
    if (length > count) {
      txn.userInputs.outputs.splice(count, 1);
    } else if (length < count) {
      for (let i = length; i < count; i += 1)
        txn.userInputs.outputs.push({
          address: '',
          amount: '',
          remarks: '',
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

  const getTronFeeAmount = (txn: IPreparedTransaction | undefined) => {
    if (!txn) return '0';
    const { computedData } = txn as IPreparedTronTransaction;
    return computedData.fee || '0';
  };

  const getXrpFeeAmount = (txn: IPreparedTransaction | undefined) => {
    if (!txn) return '0';
    const { computedData } = txn as IPreparedXrpTransaction;
    return computedData.fees || '0';
  };

  const getStarknetFeeAmount = (txn: IPreparedTransaction | undefined) => {
    if (!txn) return '0';
    const { computedData } = txn as IPreparedStarknetTransaction;
    return computedData.feeData.suggestedMaxFee || '0';
  };

  const computedFeeMap: Record<
    CoinFamily,
    (txn: IPreparedTransaction | undefined) => string
  > = {
    bitcoin: getBitcoinFeeAmount,
    evm: getEvmFeeAmount,
    near: () => '0',
    solana: getSolanaFeeAmount,
    tron: getTronFeeAmount,
    xrp: getXrpFeeAmount,
    starknet: getStarknetFeeAmount,
  };

  const getComputedFee = (coinFamily: CoinFamily, txn?: IPreparedTransaction) =>
    computedFeeMap[coinFamily](txn);

  const fillExtraInput = (
    familyId: CoinFamily,
    initTransaction: IPreparedTransaction,
    data: string,
  ) => {
    const { userInputs } = initTransaction;
    if (familyId === 'xrp') {
      (userInputs.outputs[0] as any).destinationTag = parseInt(data, 10);
    }
    return userInputs;
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
    dialogName: 'sendDialog',
  });

  const getOutputError = useCallback(
    (index: number) => {
      if (transaction?.validation.outputs[index] === false) {
        return lang.strings.send.recipient.recipient.error;
      }

      if (transaction?.validation.ownOutputAddressNotAllowed[index]) {
        return lang.strings.send.recipient.recipient.ownAddress;
      }

      return '';
    },
    [transaction, lang],
  );

  const getAmountError = useCallback(() => {
    if (transaction?.validation.zeroAmountNotAllowed) {
      return lang.strings.send.recipient.amount.zeroAmount;
    }

    if (
      (transaction?.validation as IPreparedBtcTransaction['validation'])
        .isNotOverDustThreshold
    ) {
      return lang.strings.send.recipient.amount.notOverDustThreshold;
    }

    if (transaction?.validation.hasEnoughBalance === false) {
      return lang.strings.send.recipient.amount.error;
    }

    const xrpValidation =
      transaction?.validation as IPreparedXrpTransaction['validation'];

    if (xrpValidation.isBalanceBelowXrpReserve && selectedAccount) {
      const reserveBalance = selectedAccount.spendableBalance
        ? new BigNumber(selectedAccount.balance)
            .minus(selectedAccount.spendableBalance)
            .toString()
        : '1000000'; // 1 XRP

      const { amount: _amount, unit } = getParsedAmount({
        coinId: selectedAccount.parentAssetId,
        assetId: selectedAccount.assetId,
        unitAbbr:
          selectedAccount.unit ??
          getDefaultUnit(selectedAccount.parentAssetId, selectedAccount.assetId)
            .abbr,
        amount: reserveBalance,
      });

      return parseLangTemplate(
        lang.strings.send.recipient.amount.balanceBelowReserveBalance,
        { amount: _amount, unit: unit.abbr },
      );
    }

    if (xrpValidation.isAmountBelowXrpReserve && selectedAccount) {
      const reserveBalance = (transaction as IPreparedXrpTransaction).staticData
        .reserveBaseBalance;

      const { amount: _amount, unit } = getParsedAmount({
        coinId: selectedAccount.parentAssetId,
        assetId: selectedAccount.assetId,
        unitAbbr:
          selectedAccount.unit ??
          getDefaultUnit(selectedAccount.parentAssetId, selectedAccount.assetId)
            .abbr,
        amount: reserveBalance,
      });

      return parseLangTemplate(
        lang.strings.send.recipient.amount.amountBelowReserveBalance,
        { amount: _amount, unit: unit.abbr },
      );
    }

    const solanaValidation =
      transaction?.validation as IPreparedSolanaTransaction['validation'];

    if (solanaValidation.isAmountBelowRentExempt && selectedAccount) {
      const { rentExempt } = (transaction as IPreparedSolanaTransaction)
        .staticData;

      const { amount: _amount, unit } = getParsedAmount({
        coinId: selectedAccount.parentAssetId,
        assetId: selectedAccount.assetId,
        unitAbbr:
          selectedAccount.unit ??
          getDefaultUnit(selectedAccount.parentAssetId, selectedAccount.assetId)
            .abbr,
        amount: rentExempt,
      });

      return parseLangTemplate(
        lang.strings.send.recipient.amount.amountBelowReserveBalance,
        { amount: _amount, unit: unit.abbr },
      );
    }

    return '';
  }, [transaction, lang, selectedAccount]);

  const getDestinationTagError = useCallback(() => {
    if (
      (transaction?.validation as IPreparedXrpTransaction['validation'])
        .isInvalidDestinationTag
    ) {
      return lang.strings.send.recipient.destinationTag.error;
    }

    return '';
  }, [transaction, lang]);

  const onSelectionDialogNext = useCallback(async () => {
    if (
      selectedAccount &&
      selectedAccount.familyId === coinFamiliesMap.starknet
    ) {
      const currentCoinSupport = getCurrentCoinSupport() as StarknetSupport;
      const isAccountDeployed = await currentCoinSupport.isAccountDeployed({
        address: selectedAccount.xpubOrAddress,
        coinId: selectedAccount.familyId,
      });
      if (!isAccountDeployed) {
        dispatch(
          openDeployAccountDialog({
            account: selectedAccount,
            wallet: selectedWallet,
            sendTxnData: txnData,
            isWalletConnectRequest,
          }),
        );
        return onClose(true);
      }
    }
    return onNext();
  }, [onNext, selectedAccount, txnData, isWalletConnectRequest]);

  const ctx = useMemo(
    () => ({
      source,
      defaultWalletId,
      defaultAccountId,
      onNext,
      onSelectionDialogNext,
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
      transactionRef,
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
      prepareTransactionRemarks,
      prepareSendMax,
      prepareDestinationTag,
      priceConverter,
      updateUserInputs,
      isAccountSelectionDisabled: disableAccountSelection,
      getDefaultGasLimit,
      getComputedFee,
      getOutputError,
      getAmountError,
      getDestinationTagError,
      isPreparingTxn,
    }),
    [
      source,
      defaultWalletId,
      defaultAccountId,
      onNext,
      onSelectionDialogNext,
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
      transactionRef,
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
      prepareTransactionRemarks,
      prepareSendMax,
      prepareDestinationTag,
      priceConverter,
      updateUserInputs,
      disableAccountSelection,
      getDefaultGasLimit,
      getComputedFee,
      getOutputError,
      getAmountError,
      getDestinationTagError,
      isPreparingTxn,
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
  skipAccountSelection: undefined,
  prefillDetails: undefined,
  storeTransactionId: undefined,
  onClose: undefined,
  source: 'default',
};
