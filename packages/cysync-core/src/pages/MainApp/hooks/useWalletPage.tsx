import {
  getParsedAmount,
  convertToUnit,
  getZeroUnit,
  getDefaultUnit,
} from '@cypherock/coin-support-utils';
import { coinList } from '@cypherock/coins';
import {
  Throbber,
  Check,
  Close,
  AccountTableHeaderName,
  BreadcrumbDropdownItem,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import { createSelector } from '@reduxjs/toolkit';
import lodash from 'lodash';
import React, { ReactNode, useState, useMemo, useEffect } from 'react';

import { openAddAccountDialog, syncAccounts } from '~/actions';
import { CoinIcon } from '~/components';
import { routes } from '~/constants';
import { useNavigateTo, useQuery } from '~/hooks';
import {
  AccountSyncState,
  AccountSyncStateMap,
  selectLanguage,
  selectWallets,
  selectAccounts,
  selectPriceInfos,
  selectAccountSync,
  useAppSelector,
  useAppDispatch,
  selectDiscreetMode,
} from '~/store';

interface AccountTokenType {
  leftImage: React.ReactNode;
  arrow?: React.ReactNode;
  text: string;
  amount: number;
  value: number;
  displayAmount: string;
  displayValue: string;
}

interface AccountRowData {
  id: string;
  arrow?: React.ReactNode;
  leftImage: React.ReactNode;
  text: string;
  subText?: string;
  tag?: string;
  statusImage: React.ReactNode;
  amount: number;
  value: number;
  tokens?: AccountTokenType[];
  displayAmount: string;
  displayValue: string;
}

const throbberComponent = <Throbber size={20} strokeWidth={2} />;

const checkComponent = <Check width={25} height={20} />;

const errorComponent = <Close />;

const accountSyncIconMap: Record<AccountSyncState, ReactNode | undefined> = {
  [AccountSyncStateMap.syncing]: throbberComponent,
  [AccountSyncStateMap.synced]: checkComponent,
  [AccountSyncStateMap.failed]: errorComponent,
};

const comparatorMap: Record<AccountTableHeaderName, string> = {
  account: 'text',
  amount: 'amount',
  value: 'value',
};

const searchFilter = (
  searchTerm: string,
  data: AccountRowData[] = [],
): AccountRowData[] => {
  if (!searchTerm) {
    return data;
  }

  return data
    .filter(row => {
      if (row.text.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }

      return row.tokens
        ? row.tokens.some(token =>
            token.text.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : false;
    })
    .map(row => {
      if (row.tokens) {
        return {
          ...row,
          tokens: row.tokens.filter(token =>
            token.text.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
        };
      }
      return row;
    });
};

const selector = createSelector(
  [
    selectLanguage,
    selectWallets,
    selectAccounts,
    selectPriceInfos,
    selectAccountSync,
    selectDiscreetMode,
  ],
  (
    lang,
    { wallets },
    { accounts },
    { priceInfos },
    { accountSyncMap },
    { active: isDiscreetMode },
  ) => ({
    lang,
    wallets,
    accounts,
    priceInfos,
    accountSyncMap,
    isDiscreetMode,
  }),
);

export const useWalletPage = () => {
  const {
    wallets,
    lang,
    accounts: allAccounts,
    priceInfos,
    accountSyncMap,
    isDiscreetMode,
  } = useAppSelector(selector);
  const dispatch = useAppDispatch();
  const navigateTo = useNavigateTo();
  const query = useQuery();

  const ITEMS_PER_PAGE = 10;

  const [itemsToShow, setItemsToShow] = useState(ITEMS_PER_PAGE);
  const [showMoreClicked, setShowMoreClicked] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [displayedData, setDisplayedData] = useState<AccountRowData[]>([]);
  const [accountList, setAccountList] = useState<AccountRowData[]>([]);

  const [sortedBy, setSortedBy] =
    React.useState<AccountTableHeaderName>('account');
  const [isAscending, setIsAscending] = useState(true);

  const selectedWallet = useMemo(
    () => wallets.find(wallet => wallet.__id === query.get('id')),
    [wallets, query],
  );
  const walletName = selectedWallet?.name;

  useEffect(() => {
    if (!selectedWallet) {
      navigateTo(routes.portfolio.path);
    }
  }, [selectedWallet]);

  const dropDownData: BreadcrumbDropdownItem[] = wallets.map(w => ({
    id: w.__id ?? '',
    text: w.name,
    checkType: 'radio',
  }));

  const accounts = useMemo(
    () => allAccounts.filter(a => a.walletId === selectedWallet?.__id),
    [allAccounts, selectedWallet],
  );

  const getDisplayDataList = (list: AccountRowData[]) => {
    const filteredData = searchFilter(searchTerm, list);

    return lodash.orderBy(
      filteredData,
      [comparatorMap[sortedBy]],
      [isAscending ? 'asc' : 'desc'],
    );
  };

  useEffect(() => {
    const mappedAccounts: AccountRowData[] = accounts.map(a => {
      const { amount, unit } = getParsedAmount({
        coinId: a.assetId,
        unitAbbr: a.unit,
        amount: a.balance,
      });

      let displayValue = '$0.00';
      let value = '0.00';
      const coinPrice = priceInfos.find(
        p => p.assetId === a.assetId && p.currency.toLowerCase() === 'usd',
      );

      if (coinPrice) {
        const balanceInDefaultUnit = convertToUnit({
          amount: a.balance,
          fromUnitAbbr: getZeroUnit(a.assetId).abbr,
          coinId: a.assetId,
          toUnitAbbr: getDefaultUnit(a.assetId).abbr,
        });
        value = new BigNumber(balanceInDefaultUnit.amount)
          .multipliedBy(coinPrice.latestPrice)
          .toFixed(2)
          .toString();
        displayValue = `$${value}`;
      }

      return {
        id: a.__id ?? '',
        leftImage: <CoinIcon size="32px" assetId={a.assetId} />,
        text: a.name,
        subText: coinList[a.assetId].name,
        tag: lodash.upperCase(a.derivationScheme),
        statusImage:
          accountSyncIconMap[
            accountSyncMap[a.__id ?? ''].syncState ?? 'synced'
          ] ?? checkComponent,
        displayAmount: `${isDiscreetMode ? '****' : amount} ${unit.abbr}`,
        displayValue: isDiscreetMode ? '$****' : displayValue,
        amount: parseFloat(amount),
        value: parseFloat(value),
      };
    });

    setAccountList(mappedAccounts);
  }, [accounts, priceInfos, accountSyncMap, isDiscreetMode]);

  useEffect(() => {
    setDisplayedData(getDisplayDataList(accountList));
  }, [searchTerm, isAscending, sortedBy, accountList]);

  const onSort = (columnName: AccountTableHeaderName) => {
    if (sortedBy === columnName) {
      setIsAscending(!isAscending);
      return;
    }
    setSortedBy(columnName);
    setIsAscending(true);
  };

  const onWalletChange = (walletId: string) => {
    navigateTo(`${routes.wallet.path}?id=${walletId}`);
  };

  const slicedData = useMemo(
    () => displayedData.slice(0, itemsToShow),
    [displayedData, itemsToShow],
  );

  const handleAddAccountClick = () => {
    dispatch(openAddAccountDialog({ walletId: selectedWallet?.__id ?? '' }));
  };

  const handleStatusClick = (row: AccountRowData) => {
    if (accountSyncMap[row.id].syncState === AccountSyncStateMap.syncing) {
      return;
    }

    const account = accounts.find(a => a.__id === row.id);

    if (account) {
      dispatch(syncAccounts({ accounts: [account] }));
    }
  };

  const handleAccountTableRow = () => {
    // TODO: navigate to account page
  };

  const handleShowMore = () => {
    if (showMoreClicked) {
      setItemsToShow(ITEMS_PER_PAGE);
    } else {
      setItemsToShow(itemsToShow + ITEMS_PER_PAGE);
    }
    setShowMoreClicked(!showMoreClicked);
  };

  return {
    accountList,
    lang,
    searchTerm,
    setSearchTerm,
    slicedData,
    isAscending,
    onSort,
    handleAccountTableRow,
    handleShowMore,
    displayedData,
    ITEMS_PER_PAGE,
    sortedBy,
    showMoreClicked,
    handleAddAccountClick,
    handleStatusClick,
    selectedWallet,
    walletName,
    onWalletChange,
    dropDownData,
  };
};
