import { formatDisplayAmount } from '@cypherock/coin-support-utils';
import { getBalanceHistory } from '@cypherock/cysync-core-services';
import { useTheme, LineGraphProps, TriangleIcon } from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import { createSelector } from '@reduxjs/toolkit';
import lodash from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';

import { openAddAccountDialog } from '~/actions';
import {
  useWalletDropdown,
  useGraphTimeRange,
  graphTimeRangeToDaysMap,
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
} from '~/store';
import { getDB } from '~/utils';
import logger from '~/utils/logger';

const selector = createSelector(
  [
    selectLanguage,
    selectWallets,
    selectAccounts,
    selectPriceHistories,
    selectTransactions,
    selectDiscreetMode,
  ],
  (
    lang,
    { wallets },
    { accounts },
    { priceHistories },
    { transactions },
    { active: isDiscreetMode },
  ) => ({
    lang,
    wallets,
    accounts,
    priceHistories,
    transactions,
    isDiscreetMode,
  }),
);

export const usePortfolioPage = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { lang, accounts, transactions, priceHistories } =
    useAppSelector(selector);
  const { handleWalletChange, selectedWallet, walletDropdownList } =
    useWalletDropdown({ withSelectAll: true });
  const { rangeList, selectedRange, setSelectedRange } = useGraphTimeRange();
  const [graphData, setGraphData] = useState<LineGraphProps['data']>([]);

  const calculatePortfolioData = async () => {
    try {
      const balanceHistory = await getBalanceHistory({
        db: getDB(),
        accounts,
        transactions,
        priceHistories,
        currency: 'usd',
        days: graphTimeRangeToDaysMap[selectedRange],
        walletId:
          selectedWallet?.__id === 'all' ? undefined : selectedWallet?.__id,
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

  const formatTooltipValue: LineGraphProps['formatTooltipValue'] = ({
    value,
  }) => `$${formatDisplayAmount(value, 2, true)}`;

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
      totalBalance: `${formatDisplayAmount(currentValue, 2, true)} USD`,
      changePercent: `${
        Number.isFinite(changePercent) ? changePercent.toFixed(2) : 100
      }%`,
      changeValue: `$${formatDisplayAmount(changeValue, 2, true)}`,
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
  }, [graphData, theme]);

  const throttledCalculatePortfolioData = lodash.throttle(
    calculatePortfolioData,
    500,
  );

  useEffect(() => {
    throttledCalculatePortfolioData();
  }, [accounts, transactions, priceHistories, selectedRange, selectedWallet]);

  const handleAddAccountClick = () => {
    dispatch(openAddAccountDialog());
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
    summaryDetails,
    accounts,
    handleAddAccountClick,
  };
};
