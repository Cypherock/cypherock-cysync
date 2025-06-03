import {
  formatDisplayAmount,
  getAsset,
  getDefaultUnit,
  convertToUnit,
  getZeroUnit,
} from '@cypherock/coin-support-utils';
import { SvgProps, SwapTableHeaderName } from '@cypherock/cysync-ui';
import {
  IAccount,
  IPriceInfo,
  ITransaction,
  IWallet,
  SwapStatus,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import { format as formatDate } from 'date-fns';
import lodash from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

import { CoinIcon } from '~/components';
import { providerImageUrlMap } from '~/constants';
import { useStateToRef } from '~/hooks';
import {
  selectDiscreetMode,
  selectLanguage,
  selectPriceInfos,
  selectTransactions,
  selectUnHiddenAccounts,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { ILangState } from '~/store/lang';
import { transactionIconMap } from '~/utils';

export interface SwapTransactionRowData {
  swapId: string;
  icon: React.FC<SvgProps>;
  providerName: string;
  providerImageUrl: string;
  providerUrl: string;
  time: string;
  timestamp: number;
  dateTime: string;
  date: string;
  dateHeader: string;
  sourceWalletName: string;
  sourceAccountName: string;
  souurceAccountIcon: React.FC<SvgProps>;
  sourceAssetName: string;
  sourceAssetIcon: React.FC<SvgProps>;
  sourceXpubOrAddress: string;
  destinationWalletName: string;
  destinationAccountName: string;
  destinationAccountIcon: React.FC<SvgProps>;
  destinationAssetName: string;
  destinationAssetIcon: React.FC<SvgProps>;
  destinationXpubOrAddress: string;
  receivedDisplayAmount: string;
  sentDisplayAmount: string;
  swapStatus: SwapStatus;
  sentTransactionHash: string;
  receiveTransactionHash?: string;
  isGroupHeader: boolean;
  groupText?: string;
  groupIcon?: React.FC<{ width: string; height: string }>;
}

export const swapTransactionComparatorMap: Record<SwapTableHeaderName, string> =
  {
    provider: 'providerName',
    assetFrom: 'sourceAssetName',
    assetTo: 'destinationAssetName',
    sent: 'sentDisplayAmount',
    received: 'receivedDisplayAmount',
  };

const searchFilter = (
  searchTerm: string,
  data: SwapTransactionRowData[] = [],
): SwapTransactionRowData[] => {
  if (!searchTerm) {
    return data;
  }

  return data.filter(
    row =>
      row.providerName?.toLowerCase().includes(searchTerm.toLowerCase()) ??
      row.sourceWalletName?.toLowerCase().includes(searchTerm.toLowerCase()) ??
      row.sourceAccountName?.toLowerCase().includes(searchTerm.toLowerCase()) ??
      row.sourceAssetName?.toLowerCase().includes(searchTerm.toLowerCase()) ??
      row.destinationWalletName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
      row.destinationAccountName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
      row.destinationAssetName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
      row.swapId?.toLowerCase().includes(searchTerm.toLowerCase()),
  );
};

const selector = createSelector(
  [
    selectLanguage,
    selectWallets,
    selectUnHiddenAccounts,
    selectTransactions,
    selectPriceInfos,
    selectDiscreetMode,
  ],
  (
    lang,
    { wallets },
    { accounts },
    { transactions },
    { priceInfos },
    { active: isDiscreetMode },
  ) => ({
    lang,
    wallets,
    accounts,
    transactions,
    priceInfos,
    isDiscreetMode,
  }),
);

const findAccount = (
  accounts: IAccount[],
  accountId?: string,
): IAccount | undefined => accounts.find(a => a.__id === accountId);

const findWallet = (
  wallets: IWallet[],
  walletId?: string,
): IWallet | undefined => wallets.find(w => w.__id === walletId);

const getSwapDisplayAmount = ({
  amount,
  parentAssetId,
  assetId,
  isDiscreetMode,
  alreadyDisplayUnit = false,
}: {
  amount: string;
  parentAssetId: string;
  assetId: string;
  isDiscreetMode: boolean;
  alreadyDisplayUnit?: boolean;
}) => {
  let displayAmount = amount;
  let unit = getDefaultUnit(parentAssetId, assetId).abbr;
  if (!alreadyDisplayUnit) {
    const converted = convertToUnit({
      amount,
      coinId: parentAssetId,
      assetId,
      fromUnitAbbr: getZeroUnit(parentAssetId, assetId).abbr,
      toUnitAbbr: unit,
    });
    displayAmount = converted.amount;
    unit = converted.unit.abbr;
  }
  const formattedAmount = formatDisplayAmount(displayAmount, 8);
  return `${isDiscreetMode ? '****' : formattedAmount.fixed} ${unit}`;
};

export const mapSwapTransactionForDisplay = (params: {
  receiveTransaction: ITransaction | undefined;
  sentTransaction: ITransaction;
  priceInfos: IPriceInfo[];
  wallets: IWallet[];
  accounts: IAccount[];
  lang: ILangState;
  isDiscreetMode: boolean;
}): SwapTransactionRowData => {
  const { sentTransaction, wallets, accounts, isDiscreetMode } = params;
  const swapData = sentTransaction.swapData!;

  const sourceAccount = findAccount(accounts, swapData.sourceAccountId);
  const sourceWallet = findWallet(wallets, swapData.sourceWalletId);
  const sourceAsset = getAsset(
    sourceAccount?.parentAssetId ?? sentTransaction.parentAssetId,
    sourceAccount?.assetId ?? sentTransaction.assetId,
  );

  const destinationAccount = findAccount(
    accounts,
    swapData.destinationAccountId,
  );
  const destinationWallet = findWallet(wallets, swapData.destinationWalletId);
  const destinationAsset = getAsset(
    destinationAccount?.parentAssetId ?? sentTransaction.parentAssetId,
    destinationAccount?.assetId ?? sentTransaction.assetId,
  );

  const { timestamp } = sentTransaction;
  const dateObj = new Date(timestamp);

  const sourceAccountIcon = ({ width, height }: any) => (
    <CoinIcon
      parentAssetId={
        sourceAccount?.parentAssetId ?? sentTransaction.parentAssetId
      }
      width={width}
      height={height}
    />
  );
  const sourceAssetIcon = ({ width, height }: any) => (
    <CoinIcon
      parentAssetId={
        sourceAccount?.parentAssetId ?? sentTransaction.parentAssetId
      }
      assetId={sourceAccount?.assetId ?? sentTransaction.assetId}
      width={width}
      height={height}
    />
  );
  const destinationAccountIcon = ({ width, height }: any) => (
    <CoinIcon
      parentAssetId={
        destinationAccount?.parentAssetId ?? sentTransaction.parentAssetId
      }
      width={width}
      height={height}
    />
  );
  const destinationAssetIcon = ({ width, height }: any) => (
    <CoinIcon
      parentAssetId={
        destinationAccount?.parentAssetId ?? sentTransaction.parentAssetId
      }
      assetId={destinationAccount?.assetId ?? sentTransaction.assetId}
      width={width}
      height={height}
    />
  );

  const sentDisplayAmount = getSwapDisplayAmount({
    amount: swapData.sentAmount,
    parentAssetId:
      sourceAccount?.parentAssetId ?? sentTransaction.parentAssetId,
    assetId: sourceAccount?.assetId ?? sentTransaction.assetId,
    isDiscreetMode,
    alreadyDisplayUnit: true,
  });
  const receivedDisplayAmount = getSwapDisplayAmount({
    amount: swapData.receiveAmount,
    parentAssetId:
      destinationAccount?.parentAssetId ?? sentTransaction.parentAssetId,
    assetId: destinationAccount?.assetId ?? sentTransaction.assetId,
    isDiscreetMode,
    alreadyDisplayUnit: true,
  });

  const providerName = swapData.providerId;
  const providerImageUrl = providerImageUrlMap[swapData.providerId];
  const { providerUrl } = swapData;

  const { swapStatus } = swapData;

  return {
    swapId: swapData.swapId,
    icon: transactionIconMap[sentTransaction.type],
    providerName,
    providerImageUrl,
    providerUrl,
    time: formatDate(dateObj, 'h:mm a'),
    timestamp,
    dateTime: formatDate(dateObj, 'd/M/yy h:mm a'),
    date: formatDate(dateObj, 'd/M/yy'),
    dateHeader: formatDate(dateObj, 'eeee, MMMM d yyyy'),
    sourceWalletName: sourceWallet?.name ?? '',
    sourceAccountName: sourceAccount?.name ?? '',
    souurceAccountIcon: sourceAccountIcon,
    sourceAssetName: sourceAsset.name,
    sourceAssetIcon,
    sourceXpubOrAddress: sourceAccount?.xpubOrAddress ?? '',
    destinationWalletName: destinationWallet?.name ?? '',
    destinationAccountName: destinationAccount?.name ?? '',
    destinationAccountIcon,
    destinationAssetName: destinationAsset.name,
    destinationAssetIcon,
    sentTransactionHash: sentTransaction.hash,
    receiveTransactionHash: params.receiveTransaction?.hash ?? '',
    destinationXpubOrAddress: destinationAccount?.xpubOrAddress ?? '',
    receivedDisplayAmount,
    sentDisplayAmount,
    swapStatus,
    isGroupHeader: false,
  };
};

export const useSwapTransactions = () => {
  const {
    lang,
    wallets,
    accounts,
    transactions: allTransactions,
    priceInfos,
    isDiscreetMode,
  } = useAppSelector(selector);
  const refData = useStateToRef({
    lang,
    wallets,
    accounts,
    transactions: allTransactions,
    priceInfos,
    isDiscreetMode,
  });

  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [displayedData, setDisplayedData] = useState<SwapTransactionRowData[]>(
    [],
  );
  const [transactionList, setTransactionList] = useState<
    SwapTransactionRowData[]
  >([]);

  const [sortedBy, setSortedBy] =
    React.useState<SwapTableHeaderName>('provider');
  const [isAscending, setIsAscending] = useState(false);

  const getDisplayDataList = (list: SwapTransactionRowData[]) => {
    const filteredData = searchFilter(searchTerm, list);

    const sortedList = lodash.orderBy(
      filteredData,
      [swapTransactionComparatorMap[sortedBy]],
      [isAscending ? 'asc' : 'desc'],
    );

    return sortedList.map(t => ({ ...t, time: t.dateTime }));
  };

  const parseTransactionsList = () => {
    const allTxns = refData.current.transactions;
    const sentSwaps = allTxns.filter(
      t =>
        t.isSwap &&
        t.type === TransactionTypeMap.send &&
        t.swapData &&
        t.swapData.swapId,
    );
    const receiveSwaps = allTxns.filter(
      t => t.isSwap && t.type === TransactionTypeMap.receive && t.swapData,
    );

    const mappedTransactions: SwapTransactionRowData[] = sentSwaps.map(
      sentTxn => {
        const { swapId } = sentTxn.swapData!;
        const receiveTxn = receiveSwaps.find(
          r => r.swapData?.swapId === swapId,
        );
        return mapSwapTransactionForDisplay({
          sentTransaction: sentTxn,
          receiveTransaction: receiveTxn,
          isDiscreetMode: refData.current.isDiscreetMode,
          priceInfos: refData.current.priceInfos,
          wallets: refData.current.wallets,
          accounts: refData.current.accounts,
          lang: refData.current.lang,
        });
      },
    );

    setTransactionList(mappedTransactions);
  };

  const debounceParseTransactionList = useCallback(
    lodash.throttle(parseTransactionsList, 4000, { leading: true }),
    [],
  );

  const debounceParseTransactionListOnUserAction = useCallback(
    lodash.throttle(parseTransactionsList, 500, { leading: true }),
    [],
  );

  useEffect(() => {
    debounceParseTransactionList();
  }, [allTransactions, priceInfos, wallets, accounts]);

  useEffect(() => {
    debounceParseTransactionListOnUserAction();
  }, [isDiscreetMode, lang]);

  useEffect(() => {
    setDisplayedData(getDisplayDataList(transactionList));
  }, [searchTerm, isAscending, sortedBy, transactionList]);

  const onSort = (columnName: SwapTableHeaderName) => {
    if (sortedBy === columnName) {
      setIsAscending(!isAscending);
      return;
    }
    setSortedBy(columnName);
    setIsAscending(true);
  };

  const handleTransactionTableRow = useCallback(
    (txn: SwapTransactionRowData) => {
      console.log('handle swap open', { txn });
    },
    [dispatch],
  );

  return {
    strings: lang.strings,
    transactionList,
    lang,
    searchTerm,
    setSearchTerm,
    isAscending,
    onSort,
    handleTransactionTableRow,
    displayedData,
    sortedBy,
    dispatch,
  };
};
