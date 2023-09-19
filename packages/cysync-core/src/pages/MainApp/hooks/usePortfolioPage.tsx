import { formatDisplayAmount } from '@cypherock/coin-support-utils';
import { getBalanceHistory } from '@cypherock/cysync-core-services';
import { useTheme, LineGraphProps, TriangleIcon } from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import { createSelector } from '@reduxjs/toolkit';
import { format as formatDate } from 'date-fns';
import lodash from 'lodash';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { openAddAccountDialog } from '~/actions';
import {
  useWalletDropdown,
  useGraphTimeRange,
  graphTimeRangeToDaysMap,
  GraphTimeRangeMap,
  useStateToRef,
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
  const refData = useStateToRef({
    accounts,
    transactions,
    priceHistories,
    priceInfos,
    selectedRange,
    selectedWallet,
    isDiscreetMode,
  });

  const calculatePortfolioData = async () => {
    const data = refData.current;
    const walletId =
      data.selectedWallet?.__id === 'all'
        ? undefined
        : data.selectedWallet?.__id;

    try {
      const balanceHistory = await getBalanceHistory({
        db: getDB(),
        accounts: data.accounts,
        transactions: data.transactions,
        priceHistories: data.priceHistories,
        priceInfos: data.priceInfos,
        currency: 'usd',
        days: graphTimeRangeToDaysMap[data.selectedRange],
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
  };

  const throttledCalculatePortfolioData = useCallback(
    lodash.throttle(calculatePortfolioData, 2000),
    [],
  );

  const throttledCalculatePortfolioDataOnUserAction = useCallback(
    lodash.throttle(calculatePortfolioData, 500),
    [],
  );

  useEffect(() => {
    throttledCalculatePortfolioDataOnUserAction();
  }, [selectedWallet, selectedRange, isDiscreetMode]);

  useEffect(() => {
    throttledCalculatePortfolioData();
  }, [accounts, transactions, priceHistories, priceInfos]);

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

  const formatTooltipValue = useCallback<
    Exclude<LineGraphProps['formatTooltipValue'], undefined>
  >(
    ({ value, timestamp }) => [
      `$${formatDisplayAmount(value, 2, true)}`,
      `${formatDate(timestamp, 'hh:mm')} Hrs, ${formatDate(
        timestamp,
        'MMM d',
      )}`,
    ],
    [],
  );

  const formatTimestamp = useCallback<
    Exclude<LineGraphProps['formatTimestamp'], undefined>
  >(
    timestamp =>
      formatDate(
        timestamp,
        selectedRange === GraphTimeRangeMap.year ? 'MMM yyyy' : 'MMM d',
      ),
    [selectedRange],
  );

  const formatYAxisTick = useCallback<
    Exclude<LineGraphProps['formatYAxisTick'], undefined>
  >(
    value => (isDiscreetMode ? '****' : formatDisplayAmount(value, 2, true)),
    [isDiscreetMode],
  );

  const handleAddAccountClick = () => {
    dispatch(openAddAccountDialog());
  };

  const onAssetClick = (parentAssetId: string, assetId: string) => {
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
    onAssetClick,
    wallets,
  };
};
