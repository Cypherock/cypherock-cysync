import {
  getParsedAmount,
  getDefaultUnit,
  getAsset,
  formatDisplayAmount,
} from '@cypherock/coin-support-utils';
import { coinList } from '@cypherock/coins';
import { getCoinAllocations } from '@cypherock/cysync-core-services';
import { BigNumber } from '@cypherock/cysync-utils';
import { logger } from '@cypherock/sdk-core/dist/utils';
import { createSelector } from '@reduxjs/toolkit';
import lodash from 'lodash';
import React, { useState, useEffect, useCallback, ReactNode } from 'react';

import { getDB } from '~/utils';

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
  assetId: string;
  parentAssetId: string;
  assetIcon: ReactNode;
  assetAbbr: string;
  assetName: string;
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
}

export const useAssetAllocations = ({
  walletId,
  assetId,
  parentAssetId,
  accountId,
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
      const result = await getCoinAllocations({
        db: getDB(),
        walletId: data.walletId,
        assetId: data.assetId,
        parentAssetId: data.parentAssetId,
      });

      setCoinAllocations(
        result.map(r => {
          const { amount, unit } = getParsedAmount({
            coinId: r.parentAssetId,
            assetId: r.assetId,
            unitAbbr: getDefaultUnit(r.parentAssetId, r.assetId).abbr,
            amount: r.balance,
          });

          const asset = getAsset(r.parentAssetId, r.assetId);

          return {
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
          };
        }),
      );
    } catch (error) {
      logger.error('Error in calculating portfolio allocation share');
      logger.error(error);
    }
  };

  const debounceGenerateCoinAllocations = useCallback(
    lodash.throttle(generateCoinAllocations, 1000, { leading: true }),
    [],
  );

  useEffect(() => {
    debounceGenerateCoinAllocations();
  }, [
    allTransactions,
    priceInfos,
    isDiscreetMode,
    wallets,
    accounts,
    lang,
    walletId,
    assetId,
    parentAssetId,
    accountId,
  ]);

  return {
    strings: lang.strings,
    coinAllocations,
    lang,
    dispatch,
  };
};
