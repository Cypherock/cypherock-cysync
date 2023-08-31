import { getCoinSupport } from '@cypherock/coin-support';
import {
  getParsedAmount,
  convertToUnit,
  getZeroUnit,
  getDefaultUnit,
} from '@cypherock/coin-support-utils';
import { coinList } from '@cypherock/coins';
import {
  SvgProps,
  TransactionTableStatus,
  useTheme,
  TransactionTableHeaderName,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import {
  IAccount,
  IPriceInfo,
  ITransaction,
  IWallet,
} from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import { format as formatDate } from 'date-fns';
import lodash from 'lodash';
import React, { useState, useEffect } from 'react';

import { openHistoryDialog } from '~/actions';
import { CoinIcon } from '~/components';
import { useWindowSize } from '~/hooks';
import {
  selectLanguage,
  selectWallets,
  selectPriceInfos,
  useAppSelector,
  selectDiscreetMode,
  selectTransactions,
  useAppDispatch,
  selectAccounts,
} from '~/store';
import { ILangState } from '~/store/lang';
import { transactionIconMap, getDisplayTransactionType } from '~/utils';

interface TransactionRowData {
  id: string;
  hash: string;
  assetName: string;
  accountName: string;
  accountTag: string;
  walletName: string;
  walletAndAccount: string;
  displayAmount: string;
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
  amount: number;
  value: number;
  explorerLink: string;
  txn: ITransaction;
}

const comparatorMap: Record<TransactionTableHeaderName, string> = {
  time: 'timestamp',
  asset: 'assetName',
  account: 'walletAndAccount',
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
    selectAccounts,
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
    coinId: transaction.assetId,
    unitAbbr: getDefaultUnit(transaction.assetId).abbr,
    amount: transaction.amount,
  });

  const { amount: fee, unit: feeUnit } = getParsedAmount({
    coinId: transaction.assetId,
    unitAbbr: getDefaultUnit(transaction.assetId).abbr,
    amount: transaction.fees,
  });

  let displayValue = '$0.00';
  let value = '0.00';
  let displayFeeValue = '$0.00';
  const coinPrice = priceInfos.find(
    p =>
      p.assetId === transaction.assetId && p.currency.toLowerCase() === 'usd',
  );
  const wallet = wallets.find(w => w.__id === transaction.walletId);
  const account = accounts.find(a => a.__id === transaction.accountId);

  if (coinPrice) {
    const amountInDefaultUnit = convertToUnit({
      amount: transaction.amount,
      fromUnitAbbr: getZeroUnit(transaction.assetId).abbr,
      coinId: transaction.assetId,
      toUnitAbbr: getDefaultUnit(transaction.assetId).abbr,
    });
    value = new BigNumber(amountInDefaultUnit.amount)
      .multipliedBy(coinPrice.latestPrice)
      .toFixed(2)
      .toString();
    displayValue = `$${value}`;

    const feeInDefaultUnit = convertToUnit({
      amount: transaction.fees,
      fromUnitAbbr: getZeroUnit(transaction.assetId).abbr,
      coinId: transaction.assetId,
      toUnitAbbr: getDefaultUnit(transaction.assetId).abbr,
    });
    const feeValue = new BigNumber(feeInDefaultUnit.amount)
      .multipliedBy(coinPrice.latestPrice)
      .toFixed(2)
      .toString();
    displayFeeValue = `$${feeValue}`;
  }

  const timestamp = new Date(transaction.timestamp);
  const timeString = formatDate(timestamp, 'h:mm a');
  const dateString = formatDate(timestamp, 'd/M/yy');
  const dateTime = formatDate(timestamp, 'eeee, MMMM d yyyy h:mm a');

  return {
    id: transaction.__id ?? '',
    hash: transaction.hash,
    timestamp: transaction.timestamp,
    time: timeString,
    date: dateString,
    dateTime,
    walletAndAccount: `${wallet?.name ?? ''} ${account?.name ?? ''} ${
      account?.derivationScheme ?? ''
    }`,
    assetName: coinList[transaction.assetId].name,
    accountName: account?.name ?? '',
    accountTag: lodash.upperCase(account?.derivationScheme ?? ''),
    displayAmount: `${isDiscreetMode ? '****' : amount} ${unit.abbr}`,
    displayValue: isDiscreetMode ? '$****' : displayValue,
    displayFee: `${isDiscreetMode ? '****' : fee} ${feeUnit.abbr}`,
    displayFeeValue: isDiscreetMode ? '$****' : displayFeeValue,
    amount: parseFloat(amount),
    value: parseFloat(value),
    accountIcon: ({ width, height }: any) => (
      <CoinIcon assetId={transaction.assetId} width={width} height={height} />
    ),
    assetIcon: ({ width, height }: any) => (
      <CoinIcon assetId={transaction.assetId} width={width} height={height} />
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
  };
};

export const useHistoryPage = () => {
  const {
    lang,
    wallets,
    accounts,
    transactions: allTransactions,
    priceInfos,
    isDiscreetMode,
  } = useAppSelector(selector);
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

  const getDisplayDataList = (list: TransactionRowData[]) => {
    const filteredData = searchFilter(searchTerm, list);

    return lodash.orderBy(
      filteredData,
      [comparatorMap[sortedBy]],
      [isAscending ? 'asc' : 'desc'],
    );
  };

  useEffect(() => {
    const mappedTransactions: TransactionRowData[] = allTransactions.map(t =>
      mapTransactionForDisplay({
        transaction: t,
        isDiscreetMode,
        priceInfos,
        wallets,
        accounts,
        lang,
      }),
    );

    setTransactionList(mappedTransactions);
  }, [allTransactions, priceInfos, isDiscreetMode, wallets, accounts, lang]);

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

  const handleTransactionTableRow = (txn: TransactionRowData) => {
    dispatch(openHistoryDialog({ txn: txn.txn }));
  };

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
  };
};
