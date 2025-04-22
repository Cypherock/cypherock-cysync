import { useState, useEffect, useCallback, useMemo } from 'react';
import { selectAccountSync, selectPriceInfos, useAppSelector } from '@/store';
import { selectWallets, selectUnHiddenAccounts } from '@/store';
import { ILangState, selectLanguage } from '@/store/lang';
import {
  ITransaction,
  IPriceInfo,
  IWallet,
  IAccount,
  TransactionStatus,
  TransactionTypeMap,
} from '@cypherock/db-interfaces';
import lodash from 'lodash';
const {
  convertToUnit,
  formatDisplayAmount,
  formatDisplayPrice,
  getAsset,
  getDefaultUnit,
  getParsedAmount,
  getZeroUnit,
} = require('@cypherock/coin-support-utils');
import { getDisplayTransactionType } from '@/utils/transactions';
const { getCoinSupport } = require('@cypherock/coin-support');
import { BigNumber } from '@cypherock/cysync-utils';
import { format as formatDate } from 'date-fns';
import { CoinIcon } from '@/components/core';
import { selectTransactions } from '@/store/transaction';
import { LanguageStrings } from '@/constants';

type TransactionType = keyof typeof TransactionTypeMap;

export type TransactionTableHeaderKeys =
  keyof LanguageStrings['history']['history']['table'];

export interface TransactionRowData {
  id: string;
  xpubOrAddress: string;
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
  displayFeeWithoutUnit: string;
  displayFeeUnit: string;
  displayAmountWithoutUnit: string;
  displayAmountUnit: string;
  displayValueWithoutUnit: string;
  displayValueUnit: string;
  type: TransactionType;
  typeText: string;
  status: TransactionStatus;
  statusText: string;
  assetIcon: React.FC<{ size?: number }>;
  accountIcon: React.FC<{ size?: number }>;
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
  remarks: string[];
  network: string;
  destinationTag?: number;
}

export const transactionComparatorMap: Record<
  TransactionTableHeaderKeys,
  string
> = {
  time: 'timestamp',
  amount: 'amount',
};

export const mapTransactionForDisplay = (params: {
  transaction: ITransaction;
  priceInfos: IPriceInfo[];
  wallets: IWallet[];
  accounts: IAccount[];
  lang: ILangState;
}): TransactionRowData => {
  const { transaction, priceInfos, wallets, accounts, lang } = params;

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
  const dateHeader = formatDate(timestamp, 'eeee, MMMM d, yyyy');
  const assetName = getAsset(
    transaction.parentAssetId,
    transaction.assetId,
  ).name;
  const networkName = getAsset(transaction.parentAssetId).name;
  const formattedAmount = formatDisplayAmount(amount, 8);
  const displayAmount = `${formattedAmount.fixed} ${unit.abbr}`;
  const displayAmountWithoutUnit = formattedAmount.fixed;
  const displayAmountUnit = unit.abbr;
  const amountTooltip = `${formattedAmount.complete} ${unit.abbr}`;

  const remarks: string[] = [];
  if (transaction.remarks) {
    for (let i = 0; i < transaction.remarks.length; i += 1) {
      const remark = transaction.remarks[i].trim();
      if (remark) {
        if (transaction.remarks.length === 1) {
          remarks.push(remark);
        } else {
          remarks.push(`${i + 1}. ${remark}`);
        }
      }
    }
  }

  const destinationTag = transaction.extraData?.destinationTag;

  return {
    id: transaction.__id ?? '',
    xpubOrAddress: account?.xpubOrAddress ?? '',
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
    displayValue: displayValue,
    displayValueWithoutUnit: value,
    displayValueUnit: 'USD',
    displayFee: `${fee} ${feeUnit.abbr}`,
    displayFeeValue: displayFeeValue,
    amount: parseFloat(amount),
    displayFeeWithoutUnit: fee,
    displayFeeUnit: feeUnit.abbr,
    displayAmountWithoutUnit,
    displayAmountUnit,
    value: parseFloat(value),
    accountIcon: ({ size }: any) => (
      <CoinIcon parentAssetId={transaction.parentAssetId} size={size} />
    ),
    assetIcon: ({ size }: any) => (
      <CoinIcon
        parentAssetId={transaction.parentAssetId}
        assetId={transaction.assetId}
        size={size}
      />
    ),
    status: transaction.status,
    statusText: lodash.capitalize(transaction.status),
    walletName: wallet?.name ?? '',
    type: transaction.type as any,
    typeText: getDisplayTransactionType(transaction, lang.strings),
    explorerLink: getCoinSupport(transaction.familyId).getExplorerLink({
      transaction,
    }),
    txn: transaction,
    remarks,
    network: networkName,
    destinationTag,
    isGroupHeader: false,
  };
};

export const useTransactions = () => {
  const { transactions: allTransactions } = useAppSelector(selectTransactions);
  const { priceInfos } = useAppSelector(selectPriceInfos);
  const { wallets } = useAppSelector(selectWallets);
  const { accounts } = useAppSelector(selectUnHiddenAccounts);
  const { syncState } = useAppSelector(selectAccountSync);
  const lang = useAppSelector(selectLanguage);

  const [searchTerm, setSearchTerm] = useState('');
  const [displayedData, setDisplayedData] = useState<TransactionRowData[]>([]);
  const [transactionList, setTransactionList] = useState<TransactionRowData[]>(
    [],
  );
  const [sortedBy, setSortedBy] = useState<TransactionTableHeaderKeys>('time');
  const [isAscending, setIsAscending] = useState(false);

  const getDisplayDataList = (list: TransactionRowData[]): any[] => {
    const sortedList = lodash.orderBy(
      list,
      [transactionComparatorMap[sortedBy]],
      [isAscending ? 'asc' : 'desc'],
    );

    if (sortedBy === 'time') {
      const newList: TransactionRowData[] = [];
      const groupedList = lodash.groupBy(sortedList, t => t.dateHeader);
      for (const [date, groupItems] of Object.entries(groupedList)) {
        newList.push({
          isGroupHeader: true,
          groupText: date,
          id: date,
        } as any);
        newList.push(...groupItems);
      }

      return newList;
    }

    // Only show date on rows when not grouping by date
    return sortedList.map(t => ({ ...t, time: t.date }));
  };

  const parseTransactionsList = () => {
    const mappedTransactions: TransactionRowData[] = allTransactions
      .filter(t => t.type !== 'hidden')
      .map(t =>
        mapTransactionForDisplay({
          transaction: t,
          priceInfos,
          wallets,
          accounts,
          lang,
        }),
      );
    setTransactionList(mappedTransactions);
  };

  const debounceParseTransactionList = useCallback(
    lodash.throttle(parseTransactionsList, 4000, { leading: true }),
    [allTransactions, wallets, accounts, lang],
  );

  useEffect(() => {
    debounceParseTransactionList();
  }, [allTransactions, priceInfos, wallets, accounts]);

  useEffect(() => {
    setDisplayedData(getDisplayDataList(transactionList));
  }, [searchTerm, isAscending, sortedBy, transactionList]);

  const onSort = (columnName: TransactionTableHeaderKeys) => {
    if (sortedBy === columnName) {
      setIsAscending(!isAscending);
      return;
    }
    setSortedBy(columnName);
    setIsAscending(true);
  };

  return useMemo(
    () => ({
      searchTerm,
      setSearchTerm,
      isAscending,
      onSort,
      displayedData,
      transactions: allTransactions,
      sortedBy,
      noData: wallets.length === 0 || accounts.length === 0,
      syncState,
    }),
    [searchTerm, isAscending, displayedData, sortedBy, syncState],
  );
};
