import {
  formatDisplayAmount,
  formatDisplayPrice,
  getAsset,
  getDefaultUnit,
  getParsedAmount,
} from '@cypherock/coin-support-utils';
import { coinList } from '@cypherock/coins';
import {
  IAccountAllocation,
  ICoinAllocationWithPercentage,
  getAccountAllocations,
  getCoinAllocations,
} from '@cypherock/cysync-core-services';
import { BigNumber } from '@cypherock/cysync-utils';
import { IAccount } from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import lodash from 'lodash';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getDB } from '@/utils';

import { useStateToRef } from './useStateToRef';

import {
  selectLanguage,
  selectPriceInfos,
  selectTransactions,
  selectUnHiddenAccounts,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '@/store';
import { CoinIcon } from '@/components/core';
import { LanguageStrings } from '@/constants';

export interface CoinAllocationRow {
  id: string;
  assetId: string;
  parentAssetId: string;
  assetIcon: ReactNode;
  assetAbbr: string;
  assetName: string;
  accountId?: string;
  accountName?: string;
  accountTag?: string;
  walletName?: string;
  color: string;
  price: number;
  balance: number;
  value: number;
  displayPrice: string;
  displayBalance: string;
  balanceTooltip?: string;
  displayValue: string;
  allocation: number;
}

export type AllocationTableHeaderKeys =
  keyof LanguageStrings['portfolio']['dashboard']['table'];

const selector = createSelector(
  [
    selectLanguage,
    selectWallets,
    selectUnHiddenAccounts,
    selectTransactions,
    selectPriceInfos,
  ],
  (lang, { wallets }, { accounts }, { transactions }, { priceInfos }) => ({
    lang,
    wallets,
    accounts,
    transactions,
    priceInfos,
  }),
);

export interface UseAssetAllocationProps {
  walletId?: string;
  assetId?: string;
  parentAssetId?: string;
  accountId?: string;
  withParentIconAtBottom?: boolean;
  withSubIconAtBottom?: boolean;
}

export const allocationComparatorMap: Record<
  AllocationTableHeaderKeys,
  string
> = {
  asset: 'assetName',
  amount: 'balance',
};

export const useAssetAllocations = ({
  walletId,
  assetId,
  parentAssetId,
  accountId,
  withParentIconAtBottom,
  withSubIconAtBottom,
}: UseAssetAllocationProps = {}) => {
  const {
    lang,
    wallets,
    accounts,
    transactions: allTransactions,
    priceInfos,
  } = useAppSelector(selector);
  const refData = useStateToRef({
    lang,
    wallets,
    accounts,
    transactions: allTransactions,
    priceInfos,
    walletId,
    assetId,
    parentAssetId,
    accountId,
  });

  const dispatch = useAppDispatch();

  const [coinAllocations, setCoinAllocations] = useState<CoinAllocationRow[]>(
    [],
  );
  const [sortedCoinAllocations, setSortedCoinAllocations] = useState<
    CoinAllocationRow[]
  >([]);
  const [sortedBy, setSortedBy] = useState<AllocationTableHeaderKeys>('asset');
  const [isAscending, setIsAscending] = useState(false);

  const getSortedData = useCallback(
    (data: CoinAllocationRow[]) => {
      return lodash.orderBy(
        data,
        [allocationComparatorMap[sortedBy]],
        [isAscending ? 'asc' : 'desc'],
      );
    },
    [sortedBy, isAscending],
  );

  const generateCoinAllocations = async () => {
    try {
      const data = refData.current;
      let result: (IAccountAllocation | ICoinAllocationWithPercentage)[] = [];
      if (data.parentAssetId) {
        result = await getAccountAllocations({
          db: getDB(),
          accounts: data.accounts.filter(
            a =>
              a.parentAssetId === data.parentAssetId &&
              (!data.assetId || a.assetId === data.assetId) &&
              (!data.walletId || a.walletId === data.walletId),
          ),
          priceInfos: data.priceInfos,
        });
      } else {
        result = await getCoinAllocations({
          db: getDB(),
          walletId: data.walletId,
        });
      }

      const mappedResult = result.map(r => {
        const { amount, unit } = getParsedAmount({
          coinId: r.parentAssetId,
          assetId: r.assetId,
          unitAbbr: getDefaultUnit(r.parentAssetId, r.assetId).abbr,
          amount: r.balance,
        });

        const asset = getAsset(r.parentAssetId, r.assetId);

        const accountProperties: Partial<CoinAllocationRow> = {};

        if ((r as any).account) {
          let account: IAccount | undefined;
          account = (r as IAccountAllocation).account;

          if (account.parentAccountId) {
            account = data.accounts.find(
              a => a.__id === account?.parentAccountId,
            );
          }

          accountProperties.accountId = account?.__id;
          accountProperties.accountName = account?.name;
          accountProperties.accountTag = lodash.upperCase(
            account?.derivationScheme ?? '',
          );

          const wallet = data.wallets.find(w => w.__id === account?.walletId);
          accountProperties.walletName = wallet?.name;
        }
        const formattedAmount = formatDisplayAmount(amount);
        const displayBalance = `${formattedAmount.fixed} ${unit.abbr}`;
        const balanceTooltip = `${formattedAmount.complete} ${unit.abbr}`;

        return {
          id: `${r.parentAssetId}/${r.assetId}/${
            (r as any).account?.__id ?? ''
          }`,
          color: coinList[r.parentAssetId].color,
          allocation: r.percentage,
          assetId: r.assetId,
          parentAssetId: r.parentAssetId,
          assetAbbr: asset.abbr,
          assetName: asset.name,
          assetIcon: (
            <CoinIcon
              parentAssetId={r.parentAssetId}
              assetId={r.assetId}
              size={24}
              subIconSize={12}
              subContainerSize={16}
              withParentIconAtBottom={withParentIconAtBottom}
              withSubIconAtBottom={withSubIconAtBottom}
              withBackground
            />
          ),
          balance: new BigNumber(amount).toNumber(),
          price: new BigNumber(r.price).toNumber(),
          value: new BigNumber(r.value).toNumber(),
          displayBalance,
          balanceTooltip,
          displayPrice: `$${formatDisplayPrice(r.price)}`,
          displayValue: `$${formatDisplayPrice(r.value)}`,
          ...accountProperties,
        };
      });

      setCoinAllocations(mappedResult);
    } catch (error) {
      console.error('Error in calculating portfolio allocation share');
    }
  };

  const onSort = (columnName: AllocationTableHeaderKeys) => {
    if (sortedBy === columnName) {
      setIsAscending(p => !p);
    } else {
      setSortedBy(columnName);
      setIsAscending(true);
    }
  };

  const debounceGenerateCoinAllocations = useCallback(
    lodash.throttle(generateCoinAllocations, 4000, { leading: true }),
    [],
  );

  const debounceGenerateCoinAllocationsOnUserAction = useCallback(
    lodash.throttle(generateCoinAllocations, 500, { leading: true }),
    [],
  );

  useEffect(() => {
    debounceGenerateCoinAllocations();
  }, [allTransactions, accounts, priceInfos, wallets]);

  useEffect(() => {
    debounceGenerateCoinAllocationsOnUserAction();
  }, [lang, walletId, assetId, parentAssetId, accountId]);

  useEffect(() => {
    if (coinAllocations.length > 0) {
      setSortedCoinAllocations(getSortedData(coinAllocations));
    }
  }, [coinAllocations, sortedBy, isAscending]);

  const isAccountDisplay = useMemo(() => !!parentAssetId, [parentAssetId]);

  return {
    strings: lang.strings,
    coinAllocations: sortedCoinAllocations,
    lang,
    dispatch,
    isAccountDisplay,
    onSort,
    sortedBy,
    isAscending,
  };
};
