const {
  formatDisplayPrice,
  getDefaultUnit,
  getParsedAmount,
} = require('@cypherock/coin-support-utils');
import { getBalanceHistory } from './getBalanceHistory';
import { BigNumber } from '@cypherock/cysync-utils';
import { IAccount } from '@cypherock/db-interfaces';
import { format as formatDate } from 'date-fns';
import lodash from 'lodash';
import {
  UseGraphProps,
  CalculatePortfolioGraphDataParamsWithComputedData,
  CalculatePortfolioGraphDataParams,
} from './types';
import { memoizeFunctionWithObjectArg } from '../memoize';

export * from './types';

const getAssetDetailsFromProps = (
  accounts: IAccount[],
  props?: UseGraphProps,
) => {
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

const calculatePortfolioGraphSummary = (
  params: CalculatePortfolioGraphDataParamsWithComputedData,
) => {
  const { accounts, priceInfos, computedData, showGraphInUSD } = params;

  let currentValue = 0;
  let conversionRate = '';
  let currentBalance = '';
  let changePercent = 0;
  let changeValue = '';
  let isIncreased = false;
  let isDecreased = false;

  const { parentAssetId, assetId } = getAssetDetailsFromProps(accounts, params);
  if (parentAssetId) {
    currentBalance = `0`;

    if (assetId) {
      const priceInfo = priceInfos.find(p => p.assetId === assetId);

      if (priceInfo) {
        conversionRate = `1 ${
          getDefaultUnit(parentAssetId, assetId).abbr
        } = $ ${formatDisplayPrice(priceInfo.latestPrice)}`;
      }
    }
  }

  if (computedData.balanceHistory.length > 0) {
    if (parentAssetId) {
      const { amount } = getParsedAmount({
        amount:
          computedData.balanceHistory[computedData.balanceHistory.length - 1]
            .balance,
        coinId: parentAssetId,
        assetId,
        unitAbbr: getDefaultUnit(parentAssetId, assetId).abbr,
      });

      currentBalance = amount;
    }

    let latestValue = new BigNumber(
      computedData.balanceHistory[computedData.balanceHistory.length - 1].value,
    );
    let oldestValue = new BigNumber(computedData.balanceHistory[0].value);

    currentValue = Number(computedData.totalValue);

    if (parentAssetId && !showGraphInUSD) {
      latestValue = new BigNumber(
        computedData.balanceHistory[
          computedData.balanceHistory.length - 1
        ].balance,
      );
      oldestValue = new BigNumber(computedData.balanceHistory[0].balance);
    }

    const changeValueInNumber = latestValue.minus(oldestValue).abs();

    if (latestValue.isGreaterThan(oldestValue)) {
      isIncreased = true;
    } else if (latestValue.isLessThan(oldestValue)) {
      isDecreased = true;
    }

    if (changeValueInNumber.isZero() && oldestValue.isZero()) {
      changePercent = 0;
    } else {
      changePercent = changeValueInNumber
        .dividedBy(oldestValue)
        .multipliedBy(100)
        .toNumber();
    }

    if (parentAssetId && !showGraphInUSD) {
      const { amount } = getParsedAmount({
        amount: changeValueInNumber.toString(),
        coinId: parentAssetId,
        assetId,
        unitAbbr: getDefaultUnit(parentAssetId, assetId).abbr,
      });

      changeValue = amount;
    } else {
      changeValue = formatDisplayPrice(changeValueInNumber);
    }
  }

  return {
    totalValue: formatDisplayPrice(currentValue),
    totalBalance: currentBalance,
    conversionRate,
    changePercent: `${
      Number.isFinite(changePercent) ? `${changePercent.toFixed(2)}%` : '100%'
    }`,
    changeValue,
    isIncreased,
    isDecreased,
    changeIcon: undefined as any,
  };
};

const formatPortfolioGraphData = (
  params: CalculatePortfolioGraphDataParamsWithComputedData,
) => {
  const { accounts, showGraphInUSD, computedData, days } = params;
  const { parentAssetId, assetId } = getAssetDetailsFromProps(accounts, params);

  const computeValue = (b: {
    value: string;
    balance: string;
    timestamp: number;
  }): number => {
    if (!parentAssetId || showGraphInUSD) {
      return new BigNumber(b.value).toNumber();
    } else {
      const defaultUnit = getDefaultUnit(parentAssetId, assetId);
      const { amount } = getParsedAmount({
        amount: b.balance,
        coinId: parentAssetId,
        assetId,
        unitAbbr: defaultUnit.abbr,
      });
      return new BigNumber(amount).toNumber();
    }
  };

  if (days === 365) {
    const grouped = lodash.groupBy(computedData.balanceHistory, entry =>
      formatDate(entry.timestamp, 'yyyy-MM-dd'),
    );

    const result = lodash
      .chain(grouped)
      .map((entries, dayKey) => {
        const total = lodash.sumBy(entries, entry => computeValue(entry));
        const count = entries.length;
        return {
          timestamp: new Date(dayKey).getTime(),
          value: total / count,
          date: new Date(dayKey),
        };
      })
      .sortBy('date')
      .map(entry => lodash.omit(entry, 'date'))
      .value();

    return result;
  }

  if (!parentAssetId || showGraphInUSD) {
    return computedData.balanceHistory.map(b => ({
      timestamp: b.timestamp,
      value: new BigNumber(b.value).toNumber(),
    }));
  }

  const defaultUnit = getDefaultUnit(parentAssetId, assetId);

  return computedData.balanceHistory.map(b => {
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
};

export const calculatePortfolioGraphData = memoizeFunctionWithObjectArg(
  async (params: CalculatePortfolioGraphDataParams) => {
    const walletId = params.selectedWallet?.__id;

    try {
      let balanceHistory = await getBalanceHistory({
        accounts: params.accounts,
        transactions: params.transactions,
        priceHistories: params.priceHistories,
        priceInfos: params.priceInfos,
        currency: 'usd',
        days: params.days,
        walletId,
        assetId: params.assetId,
        parentAssetId: params.parentAssetId,
        accountId: params.accountId,
      });

      if (params.selectedRange === 'month') {
        const msInDay = 24 * 60 * 60 * 1000;
        balanceHistory.balanceHistory = balanceHistory.balanceHistory.filter(
          h => h.timestamp > new Date().getTime() - 32 * msInDay,
        );
      }

      const paramsWithComputedData = {
        ...params,
        computedData: balanceHistory,
      };

      const summary = calculatePortfolioGraphSummary(paramsWithComputedData);
      const graphData = formatPortfolioGraphData(paramsWithComputedData);

      return { balanceHistory, summary, graphData };
    } catch (error) {
      console.error('Error in calculatePortfolioGraphData:', error);
    }

    return undefined;
  },
);

export type CalculatePortfolioGraphDataType =
  typeof calculatePortfolioGraphData;
