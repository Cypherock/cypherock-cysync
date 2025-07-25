import {
  formatDisplayAmount,
  getAsset,
  getDefaultUnit,
  convertToUnit,
  getZeroUnit,
  getAssetOrUndefined,
} from '@cypherock/coin-support-utils';
import { SvgProps, SwapTableHeaderName } from '@cypherock/cysync-ui';
import {
  IAccount,
  IPriceInfo,
  ISwapData,
  ITransaction,
  IWallet,
  SwapStatus,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import { format as formatDate } from 'date-fns';
import lodash from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

import { openSwapHistoryDialog } from '~/actions';
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
  sourceAccountIcon: React.FC<SvgProps>;
  sourceAssetName: string;
  sourceAssetIcon: React.FC<SvgProps>;
  sourceXpubOrAddress: string;
  destinationWalletName?: string;
  destinationAccountName?: string;
  destinationAccountIcon: React.FC<SvgProps>;
  destinationAssetName?: string;
  destinationAssetIcon: React.FC<SvgProps>;
  destinationXpubOrAddress: string;
  receivedDisplayAmount: string;
  sentDisplayAmount: string;
  swapStatus: SwapStatus;
  displaySwapStatus: string;
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
      row.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ??
      row.sourceWalletName.toLowerCase().includes(searchTerm.toLowerCase()) ??
      row.sourceAccountName.toLowerCase().includes(searchTerm.toLowerCase()) ??
      row.sourceAssetName.toLowerCase().includes(searchTerm.toLowerCase()) ??
      row.destinationWalletName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
      row.destinationAccountName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
      row.destinationAssetName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
      row.swapId.toLowerCase().includes(searchTerm.toLowerCase()),
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
  account?: Partial<IAccount>,
): IAccount | undefined => {
  if (!account) return undefined;
  return accounts.find(a =>
    Object.entries(account).every(
      ([key, value]) => a[key as keyof IAccount] === value,
    ),
  );
};

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

const getSourceAccountAndAsset = (
  accounts: IAccount[],
  wallets: IWallet[],
  sentTransaction: ITransaction,
  swapData: ISwapData,
) => {
  const sourceAccount = findAccount(accounts, {
    __id: swapData.sourceAccountId,
  });
  const sourceWallet = findWallet(wallets, swapData.sourceWalletId);
  const sourceAsset = getAsset(
    sourceAccount?.parentAssetId ?? sentTransaction.parentAssetId,
    sourceAccount?.assetId ?? sentTransaction.assetId,
  );
  return { sourceAccount, sourceWallet, sourceAsset };
};

const getDestinationAccountAndAsset = (
  accounts: IAccount[],
  wallets: IWallet[],
  swapData: ISwapData,
) => {
  const destinationAccount =
    findAccount(accounts, { __id: swapData.destinationAccountId }) ??
    findAccount(accounts, {
      xpubOrAddress: swapData.destinationAddress,
      assetId: swapData.destinationAssetId,
      parentAssetId: swapData.destinationParentAssetId,
    });
  const destinationWallet = findWallet(wallets, swapData.destinationWalletId);

  const destinationAsset = destinationAccount
    ? getAssetOrUndefined(
        destinationAccount.parentAssetId,
        destinationAccount.assetId,
      )
    : undefined;
  return { destinationAccount, destinationWallet, destinationAsset };
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

  const { sourceAccount, sourceWallet, sourceAsset } = getSourceAccountAndAsset(
    accounts,
    wallets,
    sentTransaction,
    swapData,
  );
  const { destinationAccount, destinationWallet, destinationAsset } =
    getDestinationAccountAndAsset(accounts, wallets, swapData);

  const { timestamp } = sentTransaction;
  const dateObj = new Date(timestamp);

  const sourceAccountIcon = (props: any) => (
    <CoinIcon
      parentAssetId={
        sourceAccount?.parentAssetId ?? sentTransaction.parentAssetId
      }
      assetId={undefined}
      {...props}
    />
  );
  const sourceAssetIcon = (props: any) => (
    <CoinIcon
      parentAssetId={
        sourceAccount?.parentAssetId ?? sentTransaction.parentAssetId
      }
      assetId={sourceAccount?.assetId ?? sentTransaction.assetId}
      {...props}
    />
  );

  const destinationAccountName = destinationAccount?.name;
  const destinationAccountIcon = (props: any) => (
    <CoinIcon
      parentAssetId={destinationAccount?.parentAssetId ?? ''}
      assetId={destinationAccount?.assetId}
      showFallback={!destinationAccount}
      {...props}
    />
  );
  const destinationAssetName = destinationAsset?.name;
  const destinationAssetIcon = (props: any) => (
    <CoinIcon
      parentAssetId={destinationAccount?.parentAssetId ?? ''}
      assetId={destinationAccount?.assetId}
      showFallback={!destinationAccount}
      {...props}
    />
  );
  const destinationXpubOrAddress = destinationAccount
    ? destinationAccount.xpubOrAddress
    : swapData.destinationAddress;

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
      destinationAccount?.parentAssetId ?? swapData.destinationParentAssetId,
    assetId: destinationAccount?.assetId ?? swapData.destinationAssetId,
    isDiscreetMode,
    alreadyDisplayUnit: true,
  });

  const providerName = swapData.providerId;
  const providerImageUrl = providerImageUrlMap[swapData.providerId];
  const { providerUrl, swapStatus } = swapData;

  return {
    swapId: swapData.swapId,
    icon: transactionIconMap[sentTransaction.type],
    providerName,
    providerImageUrl,
    providerUrl,
    time: formatDate(dateObj, 'h:mm a'),
    timestamp,
    dateTime: formatDate(dateObj, 'eeee, MMMM d yyyy h:mm a'),
    date: formatDate(dateObj, 'd/M/yy'),
    dateHeader: formatDate(dateObj, 'eeee, MMMM d yyyy'),
    sourceWalletName: sourceWallet?.name ?? '',
    sourceAccountName: sourceAccount?.name ?? '',
    sourceAccountIcon,
    sourceAssetName: sourceAsset.name,
    sourceAssetIcon,
    sourceXpubOrAddress: sourceAccount?.xpubOrAddress ?? '',
    destinationWalletName: destinationWallet?.name ?? '',
    destinationAccountName,
    destinationAccountIcon,
    destinationAssetName,
    destinationAssetIcon,
    sentTransactionHash: sentTransaction.hash,
    receiveTransactionHash: params.receiveTransaction?.hash ?? '',
    destinationXpubOrAddress,
    receivedDisplayAmount,
    sentDisplayAmount,
    swapStatus,
    displaySwapStatus: lodash.capitalize(swapStatus),
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

    return sortedList.map(t => ({ ...t }));
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
      dispatch(openSwapHistoryDialog({ swap: txn }));
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
