import {
  convertToUnit,
  formatDisplayAmount,
  formatDisplayPrice,
  getAsset,
  getDefaultUnit,
  getParsedAmount,
  getZeroUnit,
} from '@cypherock/coin-support-utils';
import { coinFamiliesMap, coinList } from '@cypherock/coins';
import {
  AccountTableHeaderName,
  ArrowRightBottom,
  BreadcrumbDropdownItem,
  Check,
  Close,
  Throbber,
} from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import { AccountTypeMap, IAccount, IPriceInfo } from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import lodash from 'lodash';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';

import {
  openAddAccountDialog,
  openAddTokenDialog,
  syncAccounts,
} from '~/actions';
import { CoinIcon } from '~/components';
import { routes } from '~/constants';
import { useNavigateTo, useQuery } from '~/hooks';
import {
  AccountSyncState,
  AccountSyncStateMap,
  selectAccountSync,
  selectDiscreetMode,
  selectLanguage,
  selectPriceInfos,
  selectUnHiddenAccounts,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '~/store';

export interface AccountTokenType {
  id: string;
  leftImage: React.ReactNode;
  arrow?: React.ReactNode;
  text: string;
  amount: number;
  value: number;
  displayAmount: string;
  amountTooltip?: string;
  displayValue: string;
}

export interface AccountRowData {
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
  amountTooltip?: string;
  displayValue: string;
  account: IAccount;
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

const mapTokenAccounts = (
  a: IAccount,
  priceInfos: IPriceInfo[],
  isDiscreetMode: boolean,
): AccountTokenType => {
  const { amount, unit } = getParsedAmount({
    coinId: a.parentAssetId,
    assetId: a.assetId,
    unitAbbr: a.unit ?? getDefaultUnit(a.parentAssetId, a.assetId).abbr,
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
      fromUnitAbbr: getZeroUnit(a.parentAssetId, a.assetId).abbr,
      coinId: a.parentAssetId,
      assetId: a.assetId,
      toUnitAbbr: getDefaultUnit(a.parentAssetId, a.assetId).abbr,
    });
    const formattedValue = formatDisplayPrice(
      new BigNumber(balanceInDefaultUnit.amount).multipliedBy(
        coinPrice.latestPrice,
      ),
    );
    value = formattedValue;
    displayValue = `$${formattedValue}`;
  }
  const formattedAmount = formatDisplayAmount(amount, 24);
  const displayAmount = `${isDiscreetMode ? '****' : formattedAmount.fixed} ${
    unit.abbr
  }`;
  const amountTooltip = isDiscreetMode
    ? undefined
    : `${formattedAmount.complete} ${unit.abbr}`;
  const asset = getAsset(a.parentAssetId, a.assetId);
  let { name } = a;

  if (
    a.type === AccountTypeMap.subAccount &&
    a.familyId === coinFamiliesMap.evm
  ) {
    name = asset.name;
  }

  return {
    id: a.__id ?? '',
    leftImage: (
      <CoinIcon
        size="24px"
        parentAssetId={a.parentAssetId}
        assetId={a.assetId}
      />
    ),
    text: name,
    displayAmount,
    amountTooltip,
    displayValue: isDiscreetMode ? '$****' : displayValue,
    amount: parseFloat(amount),
    value: parseFloat(value),
  };
};

const selector = createSelector(
  [
    selectLanguage,
    selectWallets,
    selectUnHiddenAccounts,
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
    () =>
      allAccounts.filter(
        a =>
          a.walletId === selectedWallet?.__id &&
          a.type === AccountTypeMap.account,
      ),
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
        coinId: a.parentAssetId,
        assetId: a.assetId,
        unitAbbr: a.unit ?? getDefaultUnit(a.parentAssetId, a.assetId).abbr,
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
          fromUnitAbbr: getZeroUnit(a.parentAssetId, a.assetId).abbr,
          coinId: a.parentAssetId,
          assetId: a.assetId,
          toUnitAbbr: getDefaultUnit(a.parentAssetId, a.assetId).abbr,
        });
        const formattedValue = formatDisplayPrice(
          new BigNumber(balanceInDefaultUnit.amount).multipliedBy(
            coinPrice.latestPrice,
          ),
        );
        value = formattedValue;
        displayValue = `$${formattedValue}`;
      }

      const tokenAccounts = allAccounts
        .filter(ta => ta.parentAccountId === a.__id)
        .map(tokenAccount =>
          mapTokenAccounts(tokenAccount, priceInfos, isDiscreetMode),
        );

      if (tokenAccounts.length > 0) {
        tokenAccounts[0].arrow = <ArrowRightBottom />;
      }
      const formattedAmount = formatDisplayAmount(amount, 24);
      const displayAmount = `${
        isDiscreetMode ? '****' : formattedAmount.fixed
      } ${unit.abbr}`;
      const amountTooltip = isDiscreetMode
        ? undefined
        : `${formattedAmount.complete} ${unit.abbr}`;

      return {
        id: a.__id ?? '',
        leftImage: <CoinIcon size="32px" parentAssetId={a.parentAssetId} />,
        text: a.name,
        subText: coinList[a.parentAssetId].name,
        tag: lodash.upperCase(a.derivationScheme),
        statusImage:
          accountSyncIconMap[
            accountSyncMap[a.__id ?? '']?.syncState ?? 'synced'
          ] ?? checkComponent,
        displayAmount,
        amountTooltip,
        displayValue: isDiscreetMode ? '$****' : displayValue,
        amount: parseFloat(amount),
        value: parseFloat(value),
        account: a,
        tokens: tokenAccounts,
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

  const handleAddAccountClick = () => {
    dispatch(openAddAccountDialog({ walletId: selectedWallet?.__id ?? '' }));
  };

  const handleAddTokenClick = () => {
    dispatch(openAddTokenDialog({ walletId: selectedWallet?.__id ?? '' }));
  };

  const handleStatusClick = (row: AccountRowData) => {
    if (accountSyncMap[row.id]?.syncState === AccountSyncStateMap.syncing) {
      return;
    }

    const account = accounts.find(a => a.__id === row.id);

    if (account) {
      dispatch(syncAccounts({ accounts: [account] }));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAccountTableRow = async (accountId: string) => {
    navigateTo(
      `${routes.account.path}?accountId=${accountId}&fromWalletId=${selectedWallet?.__id}`,
    );
  };

  return {
    accountList,
    lang,
    searchTerm,
    setSearchTerm,
    displayedData,
    isAscending,
    onSort,
    handleAccountTableRow,
    ITEMS_PER_PAGE,
    sortedBy,
    handleAddAccountClick,
    handleAddTokenClick,
    handleStatusClick,
    selectedWallet,
    walletName,
    onWalletChange,
    dropDownData,
  };
};
