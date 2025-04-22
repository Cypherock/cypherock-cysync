import { CoinIcon } from '@/components/core';
import {
  selectPriceInfos,
  selectUnHiddenAccounts,
  useAppSelector,
} from '@/store';
const {
  formatDisplayAmount,
  getAsset,
  getDefaultUnit,
  getParsedAmount,
  formatDisplayPrice,
} = require('@cypherock/coin-support-utils');
import { BigNumber } from '@cypherock/cysync-utils';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import React, { useMemo } from 'react';

export interface UseSubAccountsProps {
  accountId?: string;
}

const selector = createSelector(
  [selectUnHiddenAccounts, selectPriceInfos],
  ({ accounts }, { priceInfos }) => ({
    accounts,
    priceInfos,
  }),
);

export const useSubAccounts = ({ accountId }: UseSubAccountsProps) => {
  const { accounts, priceInfos } = useAppSelector(selector);

  if (!accountId) {
    return { subAccounts: [] };
  }

  const subAccounts = useMemo(
    () =>
      accounts
        .filter(
          a =>
            a.type === AccountTypeMap.subAccount &&
            a.parentAccountId === accountId,
        )
        .map(r => {
          const { amount, unit } = getParsedAmount({
            coinId: r.parentAssetId,
            assetId: r.assetId,
            unitAbbr: getDefaultUnit(r.parentAssetId, r.assetId).abbr,
            amount: r.balance,
          });

          const asset = getAsset(r.parentAssetId, r.assetId);

          const latestPrice =
            priceInfos.find(p => p.assetId === r.assetId)?.latestPrice ?? '0';

          const value = new BigNumber(amount)
            .multipliedBy(latestPrice)
            .toString();

          const formattedAmount = formatDisplayAmount(amount);
          const displayAmount = `${formattedAmount.fixed} ${unit.abbr}`;
          const amountTooltip = `${formattedAmount.complete} ${unit.abbr}`;

          return {
            id: r.__id ?? '',
            amount: new BigNumber(r.balance).toNumber(),
            value: new BigNumber(value).toNumber(),
            assetAbbr: asset.abbr,
            assetName: asset.name,
            assetIcon: (
              <CoinIcon
                parentAssetId={r.parentAssetId}
                assetId={r.assetId}
                size={24}
                withBackground
              />
            ),
            displayAmount,
            amountTooltip,
            displayValue: `$${formatDisplayPrice(value)}`,
          };
        }),
    [accountId, accounts, priceInfos],
  );

  return {
    subAccounts,
  };
};
