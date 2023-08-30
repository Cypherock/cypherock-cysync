import { coinList } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';

/**
 * Used to format the display amount.
 *
 * If `isFixed` is true, then it'll return a string upto `precision` no of decimal places.
 * If `isFixed` is false, then it'll return a string which has `precision` no of significant digit.
 *
 * - Removes ending decimal zeroes
 * - Uses toPrecision or toFixed to round off
 */
export const formatDisplayAmount = (
  amount: string | number | BigNumber,
  precision = 4,
  isFixed = false,
) => {
  if (
    amount === '0' ||
    amount === 0 ||
    (amount instanceof BigNumber && amount.toNumber() === 0)
  )
    return '0';

  let amountStr: string;

  if (isFixed) {
    amountStr = new BigNumber(amount).toFixed(precision, BigNumber.ROUND_FLOOR);
  } else {
    amountStr = new BigNumber(amount).toPrecision(
      precision,
      BigNumber.ROUND_FLOOR,
    );
  }

  let expStr = '';
  let decimalAmountStr = amountStr.substring(0, amountStr.length);

  const eIndex = amountStr.indexOf('e');

  if (eIndex !== -1) {
    decimalAmountStr = amountStr.substring(0, eIndex);
    expStr = amountStr.substring(eIndex, amountStr.length);
  }

  const decimalArray = decimalAmountStr.split('.');
  let leftDecimalStr = '';
  let rightDecimalStr = '';

  [leftDecimalStr] = decimalArray;

  if (decimalArray.length > 1) {
    [, rightDecimalStr] = decimalArray;
  }

  let lastIndex = -1;

  for (let i = 0; i < rightDecimalStr.length; i += 1) {
    const digit = rightDecimalStr[i];

    if (digit !== '0') {
      lastIndex = i;
    }
  }

  if (lastIndex === -1) {
    const resp = leftDecimalStr + expStr;
    return resp;
  }

  const res = `${leftDecimalStr}${'.'}${rightDecimalStr.substring(
    0,
    lastIndex + 1,
  )}${expStr}`;

  return res;
};

export const getUnit = (coinId: string, unitAbbr: string) => {
  const unit = coinList[coinId].units.find(
    u => u.abbr.toLowerCase() === unitAbbr.toLowerCase(),
  );

  assert(unit, new Error(`Invalid unit found: ${unitAbbr} for coin ${coinId}`));

  return unit;
};

export const getDefaultUnit = (coinId: string) => {
  const unit = coinList[coinId].units[0];

  assert(unit, new Error(`No default unit found for coin ${coinId}`));

  return unit;
};

export const getZeroUnit = (coinId: string) => {
  const unit = coinList[coinId].units.find(u => u.magnitude === 0);

  assert(unit, new Error(`No lowest unit found for coin ${coinId}`));

  return unit;
};

export const getParsedAmount = (params: {
  coinId: string;
  unitAbbr: string;
  amount: string | number;
}) => {
  const lowestUnit = getZeroUnit(params.coinId);

  const { amount, unit } = convertToUnit({
    coinId: params.coinId,
    fromUnitAbbr: lowestUnit.abbr,
    toUnitAbbr: params.unitAbbr,
    amount: params.amount,
  });

  return { amount: formatDisplayAmount(amount), unit };
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

  let num = new BigNumber(amount).multipliedBy(
    new BigNumber(10).pow(fromUnit.magnitude),
  );

  if (toUnit.magnitude > 0) {
    num = num.dividedBy(new BigNumber(10).pow(toUnit.magnitude));
  }

  return { amount: num.toString(), unit: toUnit };
};
