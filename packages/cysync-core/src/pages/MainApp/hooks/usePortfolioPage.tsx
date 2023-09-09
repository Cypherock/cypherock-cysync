import {
  formatDisplayAmount,
  getDefaultUnit,
  getParsedAmount,
} from '@cypherock/coin-support-utils';
import { coinList } from '@cypherock/coins';
import {
  getBalanceHistory,
  getCoinAllocations,
} from '@cypherock/cysync-core-services';
import { useTheme, LineGraphProps, TriangleIcon } from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import { createSelector } from '@reduxjs/toolkit';
import { format as formatDate } from 'date-fns';
import lodash from 'lodash';
import React, { ReactNode, useEffect, useMemo, useState } from 'react';

import { openAddAccountDialog } from '~/actions';
import { CoinIcon } from '~/components';
import {
  useWalletDropdown,
  useGraphTimeRange,
  graphTimeRangeToDaysMap,
  GraphTimeRangeMap,
} from '~/hooks';
import {
  useAppSelector,
  selectLanguage,
  selectAccounts,
  selectDiscreetMode,
  selectWallets,
  selectPriceHistories,
  selectTransactions,
  useAppDispatch,
  selectPriceInfos,
} from '~/store';
import { getDB } from '~/utils';
import logger from '~/utils/logger';

export interface CoinAllocationRow {
  assetId: string;
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
    selectPriceHistories,
    selectPriceInfos,
    selectTransactions,
    selectDiscreetMode,
  ],
  (
    lang,
    { wallets },
    { accounts },
    { priceHistories },
    { priceInfos },
    { transactions },
    { active: isDiscreetMode },
  ) => ({
    lang,
    wallets,
    accounts,
    priceHistories,
    priceInfos,
    transactions,
    isDiscreetMode,
  }),
);

export const usePortfolioPage = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const {
    lang,
    accounts,
    wallets,
    transactions,
    priceHistories,
    isDiscreetMode,
    priceInfos,
  } = useAppSelector(selector);
  const { handleWalletChange, selectedWallet, walletDropdownList } =
    useWalletDropdown({ withSelectAll: true });
  const { rangeList, selectedRange, setSelectedRange } = useGraphTimeRange();
  const [graphData, setGraphData] = useState<LineGraphProps['data']>([]);
  const [coinAllocations, setCoinAllocations] = useState<CoinAllocationRow[]>(
    [],
  );

  const calculatePortfolioData = async () => {
    const walletId =
      selectedWallet?.__id === 'all' ? undefined : selectedWallet?.__id;

    try {
      const balanceHistory = await getBalanceHistory({
        db: getDB(),
        accounts,
        transactions,
        priceHistories,
        priceInfos,
        currency: 'usd',
        days: graphTimeRangeToDaysMap[selectedRange],
        walletId,
      });
      setGraphData(
        balanceHistory.map(b => ({
          timestamp: b.timestamp,
          value: new BigNumber(b.value).toNumber(),
        })),
      );
    } catch (error) {
      logger.error('Error in calculating portfolio data');
      logger.error(error);
    }

    try {
      const result = await getCoinAllocations({
        db: getDB(),
        walletId,
      });

      setCoinAllocations(
        result.map(r => {
          const { amount, unit } = getParsedAmount({
            coinId: r.assetId,
            unitAbbr: getDefaultUnit(r.assetId).abbr,
            amount: r.balance,
          });

          return {
            color: coinList[r.assetId].color ?? 'orange',
            allocation: r.percentage,
            assetId: r.assetId,
            assetAbbr: coinList[r.assetId].abbr,
            assetName: coinList[r.assetId].name,
            assetIcon: <CoinIcon assetId={r.assetId} size="24px" />,
            balance: new BigNumber(r.balance).toNumber(),
            price: new BigNumber(r.price).toNumber(),
            value: new BigNumber(r.value).toNumber(),
            displayBalance: `${
              isDiscreetMode ? '****' : formatDisplayAmount(amount)
            } ${unit.abbr}`,
            displayPrice: `$${
              isDiscreetMode ? '****' : formatDisplayAmount(r.price, 2, true)
            }`,
            displayValue: `$${
              isDiscreetMode ? '****' : formatDisplayAmount(r.value, 2, true)
            }`,
          };
        }),
      );
    } catch (error) {
      logger.error('Error in calculating portfolio allocation share');
      logger.error(error);
    }
  };

  const throttledCalculatePortfolioData = lodash.throttle(
    calculatePortfolioData,
    500,
  );

  useEffect(() => {
    throttledCalculatePortfolioData();
  }, [
    accounts,
    transactions,
    priceHistories,
    priceInfos,
    selectedRange,
    selectedWallet,
    isDiscreetMode,
  ]);

  const summaryDetails = useMemo(() => {
    let currentValue = 0;
    let changePercent = 0;
    let changeValue = 0;
    let isIncreased = false;
    let isDecreased = false;
    let changeIconColor = theme.palette.success.main;

    if (graphData.length > 0) {
      currentValue = graphData[graphData.length - 1].value;
      const oldestValue = graphData[0].value;

      changeValue = Math.abs(currentValue - oldestValue);

      if (currentValue > oldestValue) {
        isIncreased = true;
        changeIconColor = theme.palette.success.main;
      } else if (currentValue < oldestValue) {
        isDecreased = true;
        changeIconColor = theme.palette.text.error;
      }

      changePercent = Math.round(
        ((currentValue - oldestValue) / oldestValue) * 100,
      );
    }

    return {
      totalBalance: `$${
        isDiscreetMode ? '****' : formatDisplayAmount(currentValue, 2, true)
      }`,
      changePercent: `${
        Number.isFinite(changePercent) ? changePercent.toFixed(2) : 100
      }%`,
      changeValue: `$${
        isDiscreetMode ? '****' : formatDisplayAmount(changeValue, 2, true)
      }`,
      isIncreased,
      isDecreased,
      changeIcon:
        isIncreased || isDecreased ? (
          <TriangleIcon
            fill={changeIconColor}
            width={15}
            height={15}
            rotate={isIncreased ? 0 : 180}
          />
        ) : undefined,
    };
  }, [graphData, theme, isDiscreetMode]);

  const formatTooltipValue: LineGraphProps['formatTooltipValue'] = ({
    value,
    timestamp,
  }) => [
    `$${formatDisplayAmount(value, 2, true)}`,
    `${formatDate(timestamp, 'hh:mm')} Hrs, ${formatDate(timestamp, 'MMM d')}`,
  ];

  const formatTimestamp: LineGraphProps['formatTimestamp'] = timestamp =>
    formatDate(
      timestamp,
      selectedRange === GraphTimeRangeMap.year ? 'MMM yyyy' : 'MMM d',
    );

  const formatYAxisTick: LineGraphProps['formatYAxisTick'] = value =>
    isDiscreetMode ? '****' : value;

  const handleAddAccountClick = () => {
    dispatch(openAddAccountDialog());
  };

  const onAssetClick = (assetId: string) => {
    // TODO: handle navitation to coin page
    console.log(assetId);
  };

  return {
    lang,
    handleWalletChange,
    selectedWallet,
    walletDropdownList,
    rangeList,
    selectedRange,
    setSelectedRange,
    theme,
    graphData,
    formatTooltipValue,
    formatTimestamp,
    formatYAxisTick,
    summaryDetails,
    accounts,
    handleAddAccountClick,
    coinAllocations,
    onAssetClick,
    wallets,
  };
};
