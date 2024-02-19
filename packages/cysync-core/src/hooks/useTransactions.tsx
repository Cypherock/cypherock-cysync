import { getCoinSupport } from '@cypherock/coin-support';
import {
  convertToUnit,
  formatDisplayAmount,
  formatDisplayPrice,
  getAsset,
  getDefaultUnit,
  getParsedAmount,
  getZeroUnit,
} from '@cypherock/coin-support-utils';
import {
  SvgProps,
  TransactionTableHeaderName,
  TransactionTableStatus,
  useTheme,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  IAccount,
  IPriceInfo,
  ITransaction,
  IWallet,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import { format as formatDate } from 'date-fns';
import lodash from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

import { openHistoryDialog } from '~/actions';
import { CoinIcon } from '~/components';
import { useStateToRef, useWindowSize } from '~/hooks';
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
import { getDisplayTransactionType, transactionIconMap } from '~/utils';

export interface TransactionRowData {
  id: string;
  hash: string;
  assetName: string;
  accountName: string;
  accountTag: string;
  walletName: string;
  walletAndAccount: string;
  displayAmount: string;
  amountTooltip?: string;
  displayValue: string;
  displayFee: string;
  displayFeeValue: string;
  type: string;
  status: TransactionTableStatus;
  statusText: string;
  assetIcon: React.FC<{ width: string; height: string }>;
  accountIcon: React.FC<{ width: string; height: string }>;
  icon: React.FC<SvgProps>;
  time: string;
  timestamp: number;
  dateTime: string;
  date: string;
  dateHeader: string;
  amount: number;
  value: number;
  explorerLink: string;
  txn: ITransaction;
  isGroupHeader: boolean;
  groupText?: string;
  groupIcon?: React.FC<{ width: string; height: string }>;
}

export const transactionComparatorMap: Record<
  TransactionTableHeaderName,
  string
> = {
  time: 'timestamp',
  asset: 'assetName',
  wallet: 'walletName',
  account: 'accountName',
  walletAndAccount: 'walletAndAccount',
  amount: 'amount',
  value: 'value',
};

const searchFilter = (
  searchTerm: string,
  data: TransactionRowData[] = [],
): TransactionRowData[] => {
  if (!searchTerm) {
    return data;
  }

  return data.filter(
    row =>
      row.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.walletName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.walletAndAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.status.toLowerCase().includes(searchTerm.toLowerCase()),
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

export const mapTransactionForDisplay = (params: {
  transaction: ITransaction;
  priceInfos: IPriceInfo[];
  wallets: IWallet[];
  accounts: IAccount[];
  lang: ILangState;
  isDiscreetMode: boolean;
}) => {
  const { transaction, priceInfos, wallets, accounts, lang, isDiscreetMode } =
    params;

  const { amount, unit } = getParsedAmount({
    coinId: transaction.parentAssetId,
    assetId: transaction.assetId,
    unitAbbr: getDefaultUnit(transaction.parentAssetId, transaction.assetId)
      .abbr,
    amount: transaction.amount,
  });

  const { amount: fee, unit: feeUnit } = getParsedAmount({
    coinId: transaction.parentAssetId,
    unitAbbr: getDefaultUnit(transaction.parentAssetId).abbr,
    amount: transaction.fees,
  });

  let displayValue = '$0.00';
  let value = '0.00';
  let displayFeeValue = '$0.00';
  const coinPrice = priceInfos.find(
    p =>
      p.assetId === transaction.parentAssetId &&
      p.currency.toLowerCase() === 'usd',
  );
  const assetPrice = priceInfos.find(
    p =>
      p.assetId === transaction.assetId && p.currency.toLowerCase() === 'usd',
  );
  const wallet = wallets.find(w => w.__id === transaction.walletId);
  let account = accounts.find(a => a.__id === transaction.parentAccountId);
  if (!account) {
    account = accounts.find(a => a.__id === transaction.accountId);
  }

  if (coinPrice) {
    const feeInDefaultUnit = convertToUnit({
      amount: transaction.fees,
      fromUnitAbbr: getZeroUnit(transaction.parentAssetId).abbr,
      coinId: transaction.parentAssetId,
      toUnitAbbr: getDefaultUnit(transaction.parentAssetId).abbr,
    });
    const feeValue = new BigNumber(feeInDefaultUnit.amount).multipliedBy(
      coinPrice.latestPrice,
    );
    displayFeeValue = `$${formatDisplayPrice(feeValue)}`;
  }

  if (assetPrice) {
    const amountInDefaultUnit = convertToUnit({
      amount: transaction.amount,
      fromUnitAbbr: getZeroUnit(transaction.parentAssetId, transaction.assetId)
        .abbr,
      coinId: transaction.parentAssetId,
      assetId: transaction.assetId,
      toUnitAbbr: getDefaultUnit(transaction.parentAssetId, transaction.assetId)
        .abbr,
    });
    const formattedValue = formatDisplayPrice(
      new BigNumber(amountInDefaultUnit.amount).multipliedBy(
        assetPrice.latestPrice,
      ),
      2,
    );
    value = formattedValue;
    displayValue = `$${formattedValue}`;
  }

  const timestamp = new Date(transaction.timestamp);
  const timeString = formatDate(timestamp, 'h:mm a');
  const dateString = formatDate(timestamp, 'd/M/yy');
  const dateTime = formatDate(timestamp, 'eeee, MMMM d yyyy h:mm a');
  const dateHeader = formatDate(timestamp, 'eeee, MMMM d yyyy');
  const assetName = getAsset(
    transaction.parentAssetId,
    transaction.assetId,
  ).name;

  const formattedAmount = formatDisplayAmount(amount, 8);
  const displayAmount = `${isDiscreetMode ? '****' : formattedAmount.fixed} ${
    unit.abbr
  }`;
  const amountTooltip = isDiscreetMode
    ? undefined
    : `${formattedAmount.complete} ${unit.abbr}`;

  return {
    id: transaction.__id ?? '',
    hash: transaction.hash,
    timestamp: transaction.timestamp,
    time: timeString,
    date: dateString,
    dateHeader,
    dateTime,
    walletAndAccount: `${wallet?.name ?? ''} ${account?.name ?? ''} ${
      account?.derivationScheme ?? ''
    }`,
    assetName,
    accountName: account?.name ?? '',
    accountTag: lodash.upperCase(account?.derivationScheme ?? ''),
    displayAmount,
    amountTooltip,
    displayValue: isDiscreetMode ? '$****' : displayValue,
    displayFee: `${isDiscreetMode ? '****' : fee} ${feeUnit.abbr}`,
    displayFeeValue: isDiscreetMode ? '$****' : displayFeeValue,
    amount: parseFloat(amount),
    value: parseFloat(value),
    accountIcon: ({ width, height }: any) => (
      <CoinIcon
        parentAssetId={transaction.parentAssetId}
        width={width}
        height={height}
      />
    ),
    assetIcon: ({ width, height }: any) => (
      <CoinIcon
        parentAssetId={transaction.parentAssetId}
        assetId={transaction.assetId}
        width={width}
        height={height}
      />
    ),
    status: transaction.status,
    statusText: lodash.capitalize(transaction.status),
    walletName: wallet?.name ?? '',
    type: getDisplayTransactionType(transaction, lang.strings),
    icon: transactionIconMap[transaction.type],
    explorerLink: getCoinSupport(transaction.familyId).getExplorerLink({
      transaction,
    }),
    txn: transaction,
    isGroupHeader: false,
  };
};

export interface UseTransactionsProps {
  walletId?: string;
  assetId?: string;
  parentAssetId?: string;
  accountId?: string;
}

export const useTransactions = ({
  walletId,
  assetId,
  parentAssetId,
  accountId,
}: UseTransactionsProps = {}) => {
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
    walletId,
    assetId,
    parentAssetId,
    accountId,
  });

  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { windowWidth } = useWindowSize();

  const [searchTerm, setSearchTerm] = useState('');
  const [displayedData, setDisplayedData] = useState<TransactionRowData[]>([]);
  const [transactionList, setTransactionList] = useState<TransactionRowData[]>(
    [],
  );

  const [sortedBy, setSortedBy] =
    React.useState<TransactionTableHeaderName>('time');
  const [isAscending, setIsAscending] = useState(false);

  const [expandedRowIds, setExpandedRowIds] = useState<Record<string, boolean>>(
    {},
  );

  const getDisplayDataList = (list: TransactionRowData[]) => {
    const filteredData = searchFilter(searchTerm, list);

    const sortedList = lodash.orderBy(
      filteredData,
      [transactionComparatorMap[sortedBy]],
      [isAscending ? 'asc' : 'desc'],
    );

    if (sortedBy === 'time') {
      const newList: TransactionRowData[] = [];
      const groupedList = lodash.groupBy(sortedList, t => t.dateHeader);
      for (const [date, groupItems] of Object.entries(groupedList)) {
        newList.push({ isGroupHeader: true, groupText: date, id: date } as any);
        newList.push(...groupItems);
      }

      return newList;
    }

    // Only show date on rows when not grouping by date
    return sortedList.map(t => ({ ...t, time: t.date }));
  };

  const parseTransactionsList = () => {
    const mappedTransactions: TransactionRowData[] =
      refData.current.transactions
        .filter(a => {
          if (a.type === TransactionTypeMap.hidden) {
            return false;
          }
          if (
            refData.current.walletId &&
            a.walletId !== refData.current.walletId
          ) {
            return false;
          }
          if (
            refData.current.assetId &&
            a.assetId !== refData.current.assetId
          ) {
            return false;
          }
          if (
            refData.current.parentAssetId &&
            a.parentAssetId !== refData.current.parentAssetId
          ) {
            return false;
          }
          if (
            refData.current.accountId &&
            a.accountId !== refData.current.accountId
          ) {
            return false;
          }

          return true;
        })
        .map(t =>
          mapTransactionForDisplay({
            transaction: t,
            isDiscreetMode: refData.current.isDiscreetMode,
            priceInfos: refData.current.priceInfos,
            wallets: refData.current.wallets,
            accounts: refData.current.accounts,
            lang: refData.current.lang,
          }),
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
  }, [isDiscreetMode, lang, walletId, assetId, parentAssetId, accountId]);

  useEffect(() => {
    setDisplayedData(getDisplayDataList(transactionList));
  }, [searchTerm, isAscending, sortedBy, transactionList]);

  const onSort = (columnName: TransactionTableHeaderName) => {
    if (sortedBy === columnName) {
      setIsAscending(!isAscending);
      return;
    }
    setSortedBy(columnName);
    setIsAscending(true);
  };

  const handleTransactionTableRow = useCallback(
    (txn: TransactionRowData) => {
      dispatch(openHistoryDialog({ txn: txn.txn }));
    },
    [dispatch],
  );

  const onRowExpand = useCallback((row: TransactionRowData, value: boolean) => {
    setExpandedRowIds(r => {
      const copy = structuredClone(r);
      copy[row.id] = value;
      return copy;
    });
  }, []);

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
    isSmallScreen: windowWidth < (theme.screenSizes.lg as any),
    expandedRowIds,
    onRowExpand,
  };
};
