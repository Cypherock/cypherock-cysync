import {
  formatDisplayAmount,
  formatDisplayPrice,
  getDefaultUnit,
} from '@cypherock/coin-support-utils';
import { ICoinUnit } from '@cypherock/coins';
import type { CalculatePortfolioGraphDataParams } from '@cypherock/cysync-core-workers';
import { LineGraphProps, TriangleIcon, useTheme } from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import { createSelector } from '@reduxjs/toolkit';
import { format as formatDate } from 'date-fns';
import lodash from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

import { openAddAccountDialog } from '~/actions';
import {
  GraphTimeRangeMap,
  graphTimeRangeToDaysMap,
  useGraphTimeRange,
  useStateToRef,
} from '~/hooks';
import {
  selectDiscreetMode,
  selectLanguage,
  selectPriceHistories,
  selectPriceInfos,
  selectTransactions,
  selectUnHiddenAccounts,
  selectWallets,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import logger from '~/utils/logger';

import { UseGraphProps } from './types';
import { calculatePortfolioGraphDataWithWorker } from './worker';

export * from './types';

const selector = createSelector(
  [
    selectLanguage,
    selectWallets,
    selectUnHiddenAccounts,
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

export const useGraph = (props?: UseGraphProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const {
    lang,
    accounts,
    wallets,
    transactions,
    priceHistories,
    priceInfos,
    isDiscreetMode,
  } = useAppSelector(selector);

  const { rangeList, selectedRange, setSelectedRange } = useGraphTimeRange();

  const [calculatedData, setCalculatedData] = useState<
    Exclude<
      Awaited<ReturnType<typeof calculatePortfolioGraphDataWithWorker>>,
      undefined
    >
  >({
    balanceHistory: { balanceHistory: [], totalValue: '0' },
    summary: {
      totalValue: '$0',
      totalBalance: '',
      conversionRate: '',
      changePercent: '',
      changeValue: '',
      isIncreased: false,
      isDecreased: false,
      changeIcon: undefined,
    },
    graphData: [],
  });

  const [isLoading, setIsLoading] = useState(true);

  const [showGraphInUSD, setShowGraphInUSD] = useState(true);

  const refData = useStateToRef({
    accounts,
    transactions,
    priceHistories,
    priceInfos,
    selectedRange,
    selectedWallet: props?.selectedWallet,
    props,
    showGraphInUSD,
    theme,
    computedData: calculatedData,
  });

  const getAssetDetailsFromProps = () => {
    let parentAssetId: string | undefined;
    let assetId: string | undefined;
    if (props?.parentAssetId) {
      parentAssetId = props.parentAssetId;
      assetId = props.assetId;
    } else if (props?.accountId) {
      const account = accounts.find(a => a.__id === props.accountId);

      parentAssetId = account?.parentAssetId;
      assetId = account?.assetId;
    }

    return { parentAssetId, assetId };
  };

  const calculatePortfolioData = async (setLoading?: boolean) => {
    if (setLoading) setIsLoading(true);

    const data = refData.current;

    const params: CalculatePortfolioGraphDataParams = {
      accounts: data.accounts,
      transactions: data.transactions,
      priceHistories: data.priceHistories,
      priceInfos: data.priceInfos,
      selectedWallet: data.selectedWallet,
      assetId: data.props?.assetId,
      accountId: data.props?.accountId,
      parentAssetId: data.props?.parentAssetId,
      showGraphInUSD: data.showGraphInUSD,
      days: graphTimeRangeToDaysMap[data.selectedRange],
    };

    try {
      const result = await calculatePortfolioGraphDataWithWorker(params);
      if (result?.summary.isIncreased || result?.summary.isDecreased) {
        const changeIconColor = result.summary.isDecreased
          ? theme.palette.text.error
          : data.theme.palette.success.main;

        result.summary.changeIcon = (
          <TriangleIcon
            fill={changeIconColor}
            width={15}
            height={15}
            rotate={result.summary.isIncreased ? 0 : 180}
          />
        );
      }

      if (result) setCalculatedData(result);
    } catch (error) {
      logger.error('Error on useGraph');
      logger.error(error);
    }

    if (setLoading) setIsLoading(false);
  };

  const throttledCalculatePortfolioDataOnDataChange = useCallback(
    lodash.throttle(calculatePortfolioData, 10000, { leading: true }),
    [],
  );

  const throttledCalculatePortfolioDataOnUserAction = useCallback(
    lodash.throttle(calculatePortfolioData, 500, { leading: true }),
    [],
  );

  useEffect(() => {
    setIsLoading(true);
    throttledCalculatePortfolioDataOnUserAction(true);
  }, [
    props?.selectedWallet,
    props?.accountId,
    props?.assetId,
    props?.parentAssetId,
    selectedRange,
    showGraphInUSD,
    theme,
  ]);

  useEffect(() => {
    throttledCalculatePortfolioDataOnDataChange();
  }, [accounts, transactions, priceHistories, priceInfos]);

  const formatGraphAmountDisplay = (
    value: string | number,
    showInUSD?: boolean,
    includeUnit = false,
  ) => {
    const { parentAssetId, assetId } = getAssetDetailsFromProps();
    if (new BigNumber(value).isNaN()) return '';
    const showUnitInUSD = showInUSD ?? showGraphInUSD;
    let unit: ICoinUnit | undefined;

    if (parentAssetId) {
      unit = getDefaultUnit(parentAssetId, assetId);
    }

    const appendUnit = (v: string) => {
      if (!includeUnit) return v;

      if (unit && !showUnitInUSD) return `${v} ${unit.abbr}`;
      return `$${v}`;
    };

    if (isDiscreetMode) return appendUnit('****');

    if (showUnitInUSD) return appendUnit(formatDisplayPrice(value));
    return appendUnit(formatDisplayAmount(value).complete);
  };

  const formatTooltipValue = useCallback<
    Exclude<LineGraphProps['formatTooltipValue'], undefined>
  >(
    ({ value, timestamp }) => [
      formatGraphAmountDisplay(value, undefined, true),
      `${formatDate(timestamp, 'hh:mm')} Hrs, ${formatDate(
        timestamp,
        'MMM d',
      )}`,
    ],
    [
      showGraphInUSD,
      props?.accountId,
      props?.assetId,
      props?.parentAssetId,
      isDiscreetMode,
    ],
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
    value => formatGraphAmountDisplay(value, undefined),
    [
      showGraphInUSD,
      props?.accountId,
      props?.assetId,
      props?.parentAssetId,
      isDiscreetMode,
    ],
  );

  const handleAddAccountClick = () => {
    dispatch(openAddAccountDialog());
  };

  const onGraphSwitch = () => {
    setShowGraphInUSD(v => !v);
  };

  return {
    lang,
    rangeList,
    selectedRange,
    setSelectedRange,
    theme,
    graphData: calculatedData.graphData,
    formatTooltipValue,
    formatTimestamp,
    formatYAxisTick,
    summaryDetails: calculatedData.summary,
    accounts,
    handleAddAccountClick,
    wallets,
    onGraphSwitch,
    showGraphInUSD,
    isLoading,
    formatGraphAmountDisplay,
  };
};
