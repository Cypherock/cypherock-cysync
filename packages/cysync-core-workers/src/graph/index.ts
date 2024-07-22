import {
  formatDisplayPrice,
  getDefaultUnit,
  getParsedAmount,
} from '@cypherock/coin-support-utils';
import { getBalanceHistory } from '@cypherock/cysync-core-services';
import { BigNumber } from '@cypherock/cysync-utils';
import { IAccount } from '@cypherock/db-interfaces';

import {
  UseGraphProps,
  CalculatePortfolioGraphDataParamsWithComputedData,
} from './types';

import { CalculatePortfolioGraphDataParams } from '..';

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
  const { accounts, showGraphInUSD, computedData } = params;
  const { parentAssetId, assetId } = getAssetDetailsFromProps(accounts, params);

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

export const calculatePortfolioGraphData = async (
  params: CalculatePortfolioGraphDataParams,
) => {
  const walletId = params.selectedWallet?.__id;

  try {
    const balanceHistory = await getBalanceHistory({
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

    const paramsWithComputedData = {
      ...params,
      computedData: balanceHistory,
    };

    const summary = calculatePortfolioGraphSummary(paramsWithComputedData);

    const graphData = formatPortfolioGraphData(paramsWithComputedData);

    return { balanceHistory, summary, graphData };
  } catch (error) {
    console.error('Error in calculating portfolio data');
    console.error(error);
  }

  return undefined;
};

export type CalculatePortfolioGraphDataType =
  typeof calculatePortfolioGraphData;
