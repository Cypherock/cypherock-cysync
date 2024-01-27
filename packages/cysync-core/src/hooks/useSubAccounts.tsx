import {
  formatDisplayAmount,
  getAsset,
  getDefaultUnit,
  getParsedAmount,
} from '@cypherock/coin-support-utils';
import { formatDisplayPrice } from '@cypherock/coin-support-utils/src/unit';
import { BigNumber } from '@cypherock/cysync-utils';
import { AccountTypeMap } from '@cypherock/db-interfaces';
import { createSelector } from '@reduxjs/toolkit';
import React, { useMemo } from 'react';

import {
  CoinIcon,
  selectDiscreetMode,
  selectPriceInfos,
  selectUnHiddenAccounts,
  useAppSelector,
} from '..';

export interface UseSubAccountsProps {
  accountId: string;
}

const selector = createSelector(
  [selectUnHiddenAccounts, selectPriceInfos, selectDiscreetMode],
  ({ accounts }, { priceInfos }, { active }) => ({
    accounts,
    priceInfos,
    isDiscreetMode: active,
  }),
);

export const useSubAccounts = ({ accountId }: UseSubAccountsProps) => {
  const { accounts, priceInfos, isDiscreetMode } = useAppSelector(selector);

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
          const displayAmount = `${
            isDiscreetMode ? '****' : formattedAmount.fixed
          } ${unit.abbr}`;
          const amountTooltip = isDiscreetMode
            ? undefined
            : `${formattedAmount.complete} ${unit.abbr}`;

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
                size="24px"
              />
            ),
            displayAmount,
            amountTooltip,
            displayValue: `$${
              isDiscreetMode ? '****' : formatDisplayPrice(value)
            }`,
          };
        }),
    [accountId, accounts, priceInfos],
  );

  return {
    subAccounts,
  };
};
