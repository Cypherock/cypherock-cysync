import { coinList } from '@cypherock/coins';
import { BigNumber } from '@cypherock/cysync-utils';

export const getUnit = (coinId: string, unitAbbr: string) => {
  const unit = coinList[coinId].units.find(
    u => u.abbr.toLowerCase() === unitAbbr.toLowerCase(),
  );

  if (!unit) {
    throw new Error(`Invalid unit found: ${unitAbbr} for coin ${coinId}`);
  }

  return unit;
};

export const getDefaultUnit = (coinId: string) => {
  const unit = coinList[coinId].units[0];

  if (!unit) {
    throw new Error(`No default unit found for coin ${coinId}`);
  }

  return unit;
};

export const getLowestUnit = (coinId: string) => {
  const unit = coinList[coinId].units.find(u => u.magnitude === 0);

  if (!unit) {
    throw new Error(`No lowest unit found for coin ${coinId}`);
  }

  return unit;
};

export const getParsedAmount = (params: {
  coinId: string;
  unitAbbr: string;
  amount: string | number;
}) => {
  const lowestUnit = getLowestUnit(params.coinId);

  const { amount, unit } = convertToUnit({
    coinId: params.coinId,
    fromUnitAbbr: lowestUnit.abbr,
    toUnitAbbr: params.unitAbbr,
    amount: params.amount,
  });

  return { amount: new BigNumber(amount).toPrecision(5), unit };
};

export const convertToUnit = (params: {
  coinId: string;
  fromUnitAbbr: string;
  toUnitAbbr: string;
  amount: string | number;
}) => {
  const { coinId, fromUnitAbbr, toUnitAbbr, amount } = params;

  const fromUnit = getUnit(coinId, fromUnitAbbr);
  const toUnit = getUnit(coinId, toUnitAbbr);
  const lowestUnit = getLowestUnit(coinId);

  let num = new BigNumber(amount);

  if (lowestUnit.magnitude !== fromUnit.magnitude) {
    num = num.multipliedBy(new BigNumber(10).pow(fromUnit.magnitude));
  }

  if (toUnit.magnitude > 0) {
    num = num.dividedBy(new BigNumber(10).pow(toUnit.magnitude));
  }

  return { amount: num.toString(), unit: toUnit };
};
