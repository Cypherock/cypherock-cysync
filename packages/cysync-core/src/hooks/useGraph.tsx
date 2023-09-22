import { IBalanceHistory } from '@cypherock/coin-support-interfaces';
import {
  formatDisplayAmount,
  getDefaultUnit,
  getParsedAmount,
} from '@cypherock/coin-support-utils';
import { ICoinUnit } from '@cypherock/coins';
import { getBalanceHistory } from '@cypherock/cysync-core-services';
import { useTheme, LineGraphProps, TriangleIcon } from '@cypherock/cysync-ui';
import { BigNumber } from '@cypherock/cysync-utils';
import { createSelector } from '@reduxjs/toolkit';
import { format as formatDate } from 'date-fns';
import lodash from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

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

export interface UseGraphProps {
  assetId?: string;
  parentAssetId?: string;
  accountId?: string;
}

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

  const [balanceHistories, setBalanceHistories] = useState<IBalanceHistory[]>(
    [],
  );

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
    const walletId = data.selectedWallet?.__id;

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
        assetId: data.props?.assetId,
        parentAssetId: data.props?.parentAssetId,
        accountId: data.props?.accountId,
      });
      setBalanceHistories(balanceHistory);
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
  }, [
    accounts,
    transactions,
    priceHistories,
    priceInfos,
    props?.assetId,
    props?.accountId,
    props?.parentAssetId,
  ]);

  const summaryDetails = useMemo(() => {
    let currentValue = 0;
    let conversionRate = '';
    let currentBalance = '';
    let changePercent = 0;
    let changeValue = '';
    let isIncreased = false;
    let isDecreased = false;
    let changeIconColor = theme.palette.success.main;

    const { parentAssetId, assetId } = getAssetDetailsFromProps();
    if (parentAssetId) {
      currentBalance = isDiscreetMode
        ? '****'
        : `0 ${getDefaultUnit(parentAssetId, assetId).abbr}`;

      if (assetId) {
        const priceInfo = priceInfos.find(p => p.assetId === assetId);

        if (priceInfo) {
          conversionRate = `1 ${
            getDefaultUnit(parentAssetId, assetId).abbr
          } = $ ${formatDisplayAmount(priceInfo.latestPrice, 2, true)}`;
        }
      }
    }

    if (balanceHistories.length > 0) {
      if (parentAssetId) {
        const { amount, unit } = getParsedAmount({
          amount: balanceHistories[balanceHistories.length - 1].balance,
          coinId: parentAssetId,
          assetId,
          unitAbbr: getDefaultUnit(parentAssetId, assetId).abbr,
        });

        currentBalance = isDiscreetMode ? '****' : `${amount} ${unit.abbr}`;
      }

      let latestValue = new BigNumber(
        balanceHistories[balanceHistories.length - 1].value,
      );
      let oldestValue = new BigNumber(balanceHistories[0].value);

      currentValue = latestValue.toNumber();

      if (parentAssetId && !showGraphInUSD) {
        latestValue = new BigNumber(
          balanceHistories[balanceHistories.length - 1].balance,
        );
        oldestValue = new BigNumber(balanceHistories[0].balance);
      }

      const changeValueInNumber = latestValue.minus(oldestValue).abs();

      if (latestValue.isGreaterThan(oldestValue)) {
        isIncreased = true;
        changeIconColor = theme.palette.success.main;
      } else if (latestValue.isLessThan(oldestValue)) {
        isDecreased = true;
        changeIconColor = theme.palette.text.error;
      }

      if (changeValueInNumber.isZero() && oldestValue.isZero()) {
        changePercent = 0;
      } else {
        changePercent = Math.round(
          changeValueInNumber
            .dividedBy(oldestValue)
            .multipliedBy(100)
            .toNumber(),
        );
      }

      if (parentAssetId && !showGraphInUSD) {
        const { amount, unit } = getParsedAmount({
          amount: changeValueInNumber.toString(),
          coinId: parentAssetId,
          assetId,
          unitAbbr: getDefaultUnit(parentAssetId, assetId).abbr,
        });

        changeValue = isDiscreetMode ? '****' : `${amount} ${unit.abbr}`;
      } else {
        changeValue = `$${
          isDiscreetMode
            ? '****'
            : formatDisplayAmount(changeValueInNumber, 2, true)
        }`;
      }
    }

    return {
      totalValue: `$${
        isDiscreetMode ? '****' : formatDisplayAmount(currentValue, 2, true)
      }`,
      totalBalance: currentBalance,
      conversionRate,
      changePercent: `${
        Number.isFinite(changePercent) ? `${changePercent.toFixed(2)}%` : '100%'
      }`,
      changeValue,
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
  }, [balanceHistories, theme, isDiscreetMode, props, showGraphInUSD]);

  const graphData = useMemo(() => {
    const { parentAssetId, assetId } = getAssetDetailsFromProps();

    if (!parentAssetId || showGraphInUSD) {
      return balanceHistories.map(b => ({
        timestamp: b.timestamp,
        value: new BigNumber(b.value).toNumber(),
      }));
    }

    const defaultUnit = getDefaultUnit(parentAssetId, assetId);

    return balanceHistories.map(b => {
      const { amount } = getParsedAmount({
        amount: b.balance,
        coinId: parentAssetId,
        assetId,
        unitAbbr: defaultUnit.abbr,
      });

      return {
        timestamp: b.timestamp,
        value: new BigNumber(amount).toNumber(),
      };
    });
  }, [balanceHistories, showGraphInUSD, props]);

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
    [isDiscreetMode, showGraphInUSD, props],
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
    [isDiscreetMode, showGraphInUSD, props],
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
    graphData,
    formatTooltipValue,
    formatTimestamp,
    formatYAxisTick,
    summaryDetails,
    accounts,
    handleAddAccountClick,
    wallets,
    onGraphSwitch,
    showGraphInUSD,
  };
};
