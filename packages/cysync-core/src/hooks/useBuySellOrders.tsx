import {
  formatDisplayAmount,
  getDefaultUnit,
  convertToUnit,
  getZeroUnit,
  getAssetOrUndefined,
} from '@cypherock/coin-support-utils';
import {
  BuySellOrderRowData,
  BuySellTableHeaderName,
} from '@cypherock/cysync-ui';
import { IAccount, IBuySellOrder, IWallet } from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import lodash from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';

import { openBuySellHistoryDialog } from '~/actions';
import { CoinIcon } from '~/components';
import {
  selectBuySellOrders,
  selectDiscreetMode,
  selectLanguage,
  selectPriceInfos,
  selectUnHiddenAccounts,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { providerImageUrlMap } from '..';

const getDisplayAmount = ({
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

export const mapBuySellOrderForDisplay = (params: {
  order: IBuySellOrder;
  wallets: IWallet[];
  accounts: IAccount[];
  isDiscreetMode: boolean;
}): BuySellOrderRowData => {
  const { order, wallets, accounts, isDiscreetMode } = params;

  const providerName =
    order.provider[0].toLocaleUpperCase() + order.provider.slice(1);
  const providerImageUrl = providerImageUrlMap[order.provider];

  const destinationWallet = wallets.find(
    wallet => wallet.__id === order.walletId,
  );

  const destinationAccount = accounts.find(
    account => account.__id === order.accountId,
  );
  const destinationAccountName = destinationAccount?.name ?? '';
  const destinationAccountIcon = (props: any) => (
    <CoinIcon
      parentAssetId={destinationAccount?.parentAssetId}
      assetId={destinationAccount?.parentAssetId}
      showFallback={!destinationAccount}
      {...props}
    />
  );

  const destinationAsset = getAssetOrUndefined(
    order.parentAssetId,
    order.assetId,
  );
  const destinationAssetName = destinationAsset?.name ?? '';
  const destinationAssetIcon = (props: any) => (
    <CoinIcon
      parentAssetId={destinationAccount?.parentAssetId ?? ''}
      assetId={destinationAsset?.id}
      showFallback={!destinationAccount}
      {...props}
    />
  );

  const sentDisplayAmount = `${isDiscreetMode ? '****' : order.amountFrom} ${
    order.currencyFrom
  }`;

  const receivedDisplayAmount = getDisplayAmount({
    amount: order.amountTo || '',
    assetId: order.assetId,
    parentAssetId: order.parentAssetId,
    isDiscreetMode,
    alreadyDisplayUnit: true,
  });

  return {
    ...order,
    providerName,
    providerImageUrl,

    destinationWalletName: destinationWallet?.name ?? '',
    destinationAccountName,
    destinationAccountIcon,
    destinationAssetName,
    destinationAssetIcon,

    sentDisplayAmount,
    receivedDisplayAmount,

    isGroupHeader: false,
  };
};

const selector = createSelector(
  [
    selectLanguage,
    selectWallets,
    selectUnHiddenAccounts,
    selectBuySellOrders,
    selectPriceInfos,
    selectDiscreetMode,
  ],
  (
    lang,
    { wallets },
    { accounts },
    { orders, isLoaded },
    { priceInfos },
    { active: isDiscreetMode },
  ) => ({
    lang,
    wallets,
    accounts,
    orders,
    priceInfos,
    isDiscreetMode,
    isLoaded,
  }),
);

export const buySellOrderComparatorMap: Record<BuySellTableHeaderName, string> =
  {
    provider: 'providerName',
    assetTo: 'destinationAssetName',
    sent: 'sentDisplayAmount',
    received: 'receivedDisplayAmount',
  };

export const useBuySellOrders = () => {
  const { lang, wallets, accounts, orders, isDiscreetMode, isLoaded } =
    useAppSelector(selector);

  const dispatch = useAppDispatch();

  const [searchTerm, setSearchTerm] = useState('');

  const [sortedBy, setSortedBy] =
    React.useState<BuySellTableHeaderName>('provider');
  const [isAscending, setIsAscending] = useState(false);

  const ordersList = orders.map(order =>
    mapBuySellOrderForDisplay({
      accounts,
      order,
      isDiscreetMode,
      wallets,
    }),
  );

  const filteredData = useMemo(() => {
    if (!searchTerm) {
      return ordersList;
    }

    return ordersList.filter(
      row =>
        row.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.destinationWalletName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        row.destinationAccountName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        row.destinationAssetName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        row.id.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, ordersList]);

  const displayedData = useMemo(
    () =>
      lodash.orderBy(
        filteredData,
        [buySellOrderComparatorMap[sortedBy]],
        [isAscending ? 'asc' : 'desc'],
      ),
    [filteredData, isAscending, sortedBy],
  );

  const onSort = (columnName: BuySellTableHeaderName) => {
    if (sortedBy === columnName) {
      setIsAscending(!isAscending);
      return;
    }
    setSortedBy(columnName);
    setIsAscending(true);
  };

  const handleTransactionTableRow = useCallback(
    (txn: BuySellOrderRowData) => {
      dispatch(openBuySellHistoryDialog({ buySell: txn }));
    },
    [dispatch],
  );

  return {
    strings: lang.strings,
    orders,
    lang,
    searchTerm,
    setSearchTerm,
    isAscending,
    onSort,
    handleTransactionTableRow,
    displayedData,
    sortedBy,
    dispatch,
    isLoaded,
  };
};
