import {
  formatDisplayAmount,
  getDefaultUnit,
} from '@cypherock/coin-support-utils';
import { ICoinUnit } from '@cypherock/coins';
import { useTheme, LineGraphProps } from '@cypherock/cysync-ui';
import { createSelector } from '@reduxjs/toolkit';
import { format as formatDate } from 'date-fns';
import lodash from 'lodash';
import { useCallback, useEffect, useState } from 'react';

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

import { calculatePortfolioGraphData } from './helper';
import { UseGraphProps } from './types';

export * from './types';

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

export const useGraph = (props?: UseGraphProps) => {
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

  const [calculatedData, setCalculatedData] = useState<
    Exclude<Awaited<ReturnType<typeof calculatePortfolioGraphData>>, undefined>
  >({
    balanceHistory: { balanceHistory: [], totalValue: '0' },
    summary: {
      totalValue: '',
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

  const [showGraphInUSD, setShowGraphInUSD] = useState(true);

  const refData = useStateToRef({
    accounts,
    transactions,
    priceHistories,
    priceInfos,
    selectedRange,
    selectedWallet,
    isDiscreetMode,
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

  const calculatePortfolioData = async () => {
    const data = refData.current;

    const result = await calculatePortfolioGraphData({
      ...data,
      days: graphTimeRangeToDaysMap[data.selectedRange],
    });

    if (result) setCalculatedData(result);
  };

  const throttledCalculatePortfolioDataOnDataChange = useCallback(
    lodash.throttle(calculatePortfolioData, 5000, { leading: true }),
    [],
  );

  const throttledCalculatePortfolioDataOnUserAction = useCallback(
    lodash.throttle(calculatePortfolioData, 500, { leading: true }),
    [],
  );

  useEffect(() => {
    throttledCalculatePortfolioDataOnUserAction();
  }, [selectedWallet, selectedRange, isDiscreetMode, showGraphInUSD, theme]);

  useEffect(() => {
    throttledCalculatePortfolioDataOnDataChange();
  }, [
    accounts,
    transactions,
    priceHistories,
    priceInfos,
    props?.assetId,
    props?.accountId,
    props?.parentAssetId,
  ]);

  const formatGraphAmountDisplay = (
    value: string | number,
    includeUnit = false,
  ) => {
    const { parentAssetId, assetId } = getAssetDetailsFromProps();
    let unit: ICoinUnit | undefined;

    if (parentAssetId) {
      unit = getDefaultUnit(parentAssetId, assetId);
    }

    const appendUnit = (v: string) => {
      if (!includeUnit) return v;

      if (unit && !showGraphInUSD) return `${v} ${unit.abbr}`;
      return `$${v}`;
    };

    if (isDiscreetMode) return '****';
    if (showGraphInUSD) return appendUnit(formatDisplayAmount(value, 2, true));
    return appendUnit(formatDisplayAmount(value));
  };

  const formatTooltipValue = useCallback<
    Exclude<LineGraphProps['formatTooltipValue'], undefined>
  >(
    ({ value, timestamp }) => [
      formatGraphAmountDisplay(value, true),
      `${formatDate(timestamp, 'hh:mm')} Hrs, ${formatDate(
        timestamp,
        'MMM d',
      )}`,
    ],
    [
      isDiscreetMode,
      showGraphInUSD,
      props?.accountId,
      props?.assetId,
      props?.parentAssetId,
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
    value => formatGraphAmountDisplay(value),
    [
      isDiscreetMode,
      showGraphInUSD,
      props?.accountId,
      props?.assetId,
      props?.parentAssetId,
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
    handleWalletChange,
    selectedWallet,
    walletDropdownList,
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
  };
};
