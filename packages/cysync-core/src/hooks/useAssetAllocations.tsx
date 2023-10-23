import {
  getParsedAmount,
  getDefaultUnit,
  getAsset,
  formatDisplayAmount,
} from '@cypherock/coin-support-utils';
import { coinList } from '@cypherock/coins';
import {
  getCoinAllocations,
  ICoinAllocationWithPercentage,
  IAccountAllocation,
  getAccountAllocations,
} from '@cypherock/cysync-core-services';
import { BigNumber } from '@cypherock/cysync-utils';
import { IAccount } from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import lodash from 'lodash';
import React, {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';

import { getDB } from '~/utils';
import logger from '~/utils/logger';

import { useStateToRef } from './useStateToRef';

import {
  selectLanguage,
  selectWallets,
  selectAccounts,
  selectTransactions,
  selectPriceInfos,
  selectDiscreetMode,
  useAppSelector,
  useAppDispatch,
  CoinIcon,
} from '..';

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
  displayValue: string;
  allocation: number;
}

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

export interface UseAssetAllocationProps {
  walletId?: string;
  assetId?: string;
  parentAssetId?: string;
  accountId?: string;
  withParentIconAtBottom?: boolean;
  withSubIconAtBottom?: boolean;
}

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

  const [coinAllocations, setCoinAllocations] = useState<CoinAllocationRow[]>(
    [],
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

      setCoinAllocations(
        result.map(r => {
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
                size="24px"
                subIconSize="12px"
                subContainerSize="16px"
                withParentIconAtBottom={withParentIconAtBottom}
                withSubIconAtBottom={withSubIconAtBottom}
              />
            ),
            balance: new BigNumber(r.balance).toNumber(),
            price: new BigNumber(r.price).toNumber(),
            value: new BigNumber(r.value).toNumber(),
            displayBalance: `${
              data.isDiscreetMode ? '****' : formatDisplayAmount(amount)
            } ${unit.abbr}`,
            displayPrice: `$${
              data.isDiscreetMode
                ? '****'
                : formatDisplayAmount(r.price, 2, true)
            }`,
            displayValue: `$${
              data.isDiscreetMode
                ? '****'
                : formatDisplayAmount(r.value, 2, true)
            }`,
            ...accountProperties,
          };
        }),
      );
    } catch (error) {
      logger.error('Error in calculating portfolio allocation share');
      logger.error(error);
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
  }, [isDiscreetMode, lang, walletId, assetId, parentAssetId, accountId]);

  const isAccountDisplay = useMemo(() => !!parentAssetId, [parentAssetId]);

  return {
    strings: lang.strings,
    coinAllocations,
    lang,
    dispatch,
    isAccountDisplay,
  };
};
