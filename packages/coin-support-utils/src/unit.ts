import { coinList, IEvmCoinInfo } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';

/**
 * Used to format the display amount.
 *
 * If `isFixed` is true, then it'll return a string upto `precision` no of decimal places.
 * If `isFixed` is false, then it'll return a string which has `precision` no of significant digit.
 *
 * - Removes ending decimal zeroes
 * - Returns 0 if amount is NaN
 * - Uses toPrecision or toFixed to round off
 */
export const formatDisplayAmount = (
  amount: string | number | BigNumber,
  precision = 4,
  isFixed = false,
) => {
  if (
    amount === '0' ||
    amount.toString().toLowerCase() === 'nan' ||
    amount === 0 ||
    Number.isNaN(amount) ||
    (amount instanceof BigNumber && (amount.toNumber() === 0 || amount.isNaN()))
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

export const getUnit = (coinId: string, unitAbbr: string, assetId?: string) => {
  const coin = coinList[coinId];

  assert(coin, new Error(`No coin found ${coinId}:${assetId ?? ''}`));

  let unit = coin.units.find(u => u.abbr === unitAbbr);

  if (assetId && assetId !== coinId) {
    const token = (coin as IEvmCoinInfo).tokens[assetId];
    assert(token, new Error(`No token found for coin ${coinId}:${assetId}`));
    unit = token.units.find(u => u.abbr === unitAbbr);
  }

  assert(
    unit,
    new Error(
      `Invalid unit found: ${unitAbbr} for coin ${coinId}:${assetId ?? ''}`,
    ),
  );

  return unit;
};

export const getDefaultUnit = (coinId: string, assetId?: string) => {
  const coin = coinList[coinId];

  assert(coin, new Error(`No coin found ${coinId}:${assetId ?? ''}`));

  let unit = coin.units[0];

  if (assetId && assetId !== coinId) {
    const token = (coin as IEvmCoinInfo).tokens[assetId];
    assert(token, new Error(`No token found for coin ${coinId}:${assetId}`));
    [unit] = token.units;
  }

  assert(
    unit,
    new Error(`No default unit found for coin ${coinId}:${assetId ?? ''}`),
  );

  return unit;
};

export const getZeroUnit = (coinId: string, assetId?: string) => {
  const coin = coinList[coinId];

  assert(coin, new Error(`No coin found ${coinId}:${assetId ?? ''}`));

  let unit = coin.units.find(u => u.magnitude === 0);

  if (assetId && assetId !== coinId) {
    const token = (coin as IEvmCoinInfo).tokens[assetId];
    assert(token, new Error(`No token found for coin ${coinId}:${assetId}`));
    unit = token.units.find(u => u.magnitude === 0);
  }

  assert(
    unit,
    new Error(`No lowest unit found for coin ${coinId}:${assetId ?? ''}`),
  );

  return unit;
};

export const getParsedAmount = (params: {
  coinId: string;
  assetId?: string;
  unitAbbr: string;
  amount: string | number;
}) => {
  const lowestUnit = getZeroUnit(params.coinId, params.assetId);

  const { amount, unit } = convertToUnit({
    coinId: params.coinId,
    assetId: params.assetId,
    fromUnitAbbr: lowestUnit.abbr,
    toUnitAbbr: params.unitAbbr,
    amount: params.amount,
  });

  return { amount: formatDisplayAmount(amount), unit };
};

export const convertToUnit = (params: {
  coinId: string;
  assetId?: string;
  fromUnitAbbr: string;
  toUnitAbbr: string;
  amount: string | number;
}) => {
  const { coinId, fromUnitAbbr, toUnitAbbr, amount, assetId } = params;

  const fromUnit = getUnit(coinId, fromUnitAbbr, assetId);
  const toUnit = getUnit(coinId, toUnitAbbr, assetId);

  let num = new BigNumber(amount).multipliedBy(
    new BigNumber(10).pow(fromUnit.magnitude),
  );

  if (toUnit.magnitude > 0) {
    num = num.dividedBy(new BigNumber(10).pow(toUnit.magnitude));
  }

  return { amount: num.toString(), unit: toUnit };
};
