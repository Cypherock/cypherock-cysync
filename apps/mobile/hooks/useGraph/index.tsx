const {
  formatDisplayAmount,
  formatDisplayPrice,
  getDefaultUnit,
} = require('@cypherock/coin-support-utils');
const { ICoinUnit } = require('@cypherock/coins');
import { BigNumber } from '@cypherock/cysync-utils';
import { createSelector } from '@reduxjs/toolkit';
import { format as formatDate } from 'date-fns';
import lodash from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { IWallet } from '@cypherock/db-interfaces';
import { useTheme } from '@/components/ui';

import {
  GraphTimeRange,
  GraphTimeRangeMap,
  graphTimeRangeToDaysMap,
  useStateToRef,
} from '@/hooks';

import {
  selectLanguage,
  selectPriceHistories,
  selectPriceInfos,
  selectTransactions,
  selectUnHiddenAccounts,
  selectWallets,
  useAppSelector,
} from '@/store';
import {
  calculatePortfolioGraphData,
  CalculatePortfolioGraphDataType,
} from '@/utils';
import Entypo from '@expo/vector-icons/Entypo';

export interface UseGraphProps {
  assetId?: string;
  parentAssetId?: string;
  accountId?: string;
  selectedWallet?: IWallet;
  selectedRange: GraphTimeRange;
}

const selector = createSelector(
  [
    selectLanguage,
    selectWallets,
    selectUnHiddenAccounts,
    selectPriceHistories,
    selectPriceInfos,
    selectTransactions,
  ],
  (
    lang,
    { wallets },
    { accounts },
    { priceHistories },
    { priceInfos },
    { transactions },
  ) => ({
    lang,
    wallets,
    accounts,
    priceHistories,
    priceInfos,
    transactions,
  }),
);

export const useGraph = ({ selectedRange, ...props }: UseGraphProps) => {
  const theme = useTheme();
  const { lang, accounts, wallets, transactions, priceHistories, priceInfos } =
    useAppSelector(selector);

  const [calculatedData, setCalculatedData] = useState<
    Exclude<Awaited<ReturnType<CalculatePortfolioGraphDataType>>, undefined>
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
    theme,
    selectedWallet: props?.selectedWallet,
    props,
    showGraphInUSD,
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

  const calculatePortfolioData = useCallback(async () => {
    setIsLoading(true);

    const data = refData.current;

    const params = {
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
      selectedRange: data.selectedRange,
    };

    try {
      const result = await calculatePortfolioGraphData(params);

      if (result?.summary.isIncreased || result?.summary.isDecreased) {
        const changeIconColor = result.summary.isDecreased
          ? theme.palette.text.error
          : data.theme.palette.success;

        result.summary.changeIcon = (
          <Entypo
            name={result.summary.isIncreased ? 'triangle-up' : 'triangle-down'}
            size={16}
            color={changeIconColor}
          />
        );
      }

      if (result) setCalculatedData(result);
    } catch (error) {
      console.error('Error in calculatePortfolioData:', error);
    }

    setIsLoading(false);
  }, [refData, theme]);

  const throttledCalculatePortfolioDataOnDataChange = useCallback(
    lodash.throttle(calculatePortfolioData, 10000, { leading: true }),
    [calculatePortfolioData],
  );

  const throttledCalculatePortfolioDataOnUserAction = useCallback(
    lodash.throttle(calculatePortfolioData, 500, { leading: true }),
    [calculatePortfolioData],
  );

  useEffect(() => {
    throttledCalculatePortfolioDataOnUserAction();
  }, [
    props?.selectedWallet,
    props?.accountId,
    props?.assetId,
    props?.parentAssetId,
    selectedRange,
    showGraphInUSD,
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

    if (showUnitInUSD) return appendUnit(formatDisplayPrice(value));
    return appendUnit(formatDisplayAmount(value).complete);
  };

  const formatTooltipValue = useCallback(
    ({
      value,
      timestamp,
    }: {
      value: string | number;
      timestamp: number | Date;
    }) => [
      formatGraphAmountDisplay(value, undefined, true),
      `${formatDate(timestamp, 'hh:mm')} Hrs, ${formatDate(timestamp, 'MMM d')}`,
    ],
    [showGraphInUSD, props?.accountId, props?.assetId, props?.parentAssetId],
  );

  const formatTimestamp = useCallback(
    (timestamp: number | Date) =>
      formatDate(
        timestamp,
        selectedRange === GraphTimeRangeMap.year ? 'MMM yyyy' : 'MMM d',
      ),
    [selectedRange],
  );

  const formatYAxisTick = useCallback(
    (value: string | number) => {
      const price = new BigNumber(value);

      if (price.isGreaterThanOrEqualTo(1000)) {
        return `$${formatDisplayPrice(price.dividedBy(1000))}k`;
      } else {
        return `$${formatDisplayPrice(price)}`;
      }
    },
    [showGraphInUSD],
  );

  const onGraphSwitch = () => {
    setShowGraphInUSD(v => !v);
  };

  return {
    lang,
    selectedRange,
    graphData: calculatedData.graphData,
    formatTooltipValue,
    formatTimestamp,
    formatYAxisTick,
    summaryDetails: calculatedData.summary,
    accounts,
    wallets,
    onGraphSwitch,
    showGraphInUSD,
    isLoading,
    formatGraphAmountDisplay,
  };
};
