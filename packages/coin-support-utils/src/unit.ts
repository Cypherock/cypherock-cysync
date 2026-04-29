import { coinList, IEvmCoinInfo } from '@cypherock/coins';
import { assert, BigNumber } from '@cypherock/cysync-utils';

export const DEFAULT_CURRENCY = 'usd';
type NumberLike = string | number | BigNumber;
/**
 * Used to format the display amount.
 *
 * - Removes trailing decimal zeroes
 * - Assumes 0 if amount is NaN
 */
const formatDisplayValue = (
  value: NumberLike,
  decimal = 0,
  useCustom = false,
) => {
  let number = new BigNumber(0);
  if (
    !(
      value === '0' ||
      value.toString().toLowerCase() === 'nan' ||
      value === 0 ||
      Number.isNaN(value) ||
      (value instanceof BigNumber && (value.toNumber() === 0 || value.isNaN()))
    )
  )
    number = new BigNumber(value);

  let fixed = new BigNumber(number.toFixed(decimal)).toFixed();
  if (useCustom) {
    const precision = Math.max(decimal, 1);
    fixed = new BigNumber(
      new BigNumber(number.toFixed(decimal)).toPrecision(precision),
    ).toFixed();
  }
  const complete = number.toFixed();
  return { fixed, complete };
};

export const formatDisplayAmount = (value: NumberLike, decimal = 12) =>
  formatDisplayValue(value, decimal, true);

const currencyFormatterCache: Record<string, Intl.NumberFormat> = {};

export const formatDisplayPrice = (value: NumberLike, currencyCode: string) => {
  let number = new BigNumber(0);
  if (
    !(
      value === '0' ||
      value.toString().toLowerCase() === 'nan' ||
      value === 0 ||
      Number.isNaN(value) ||
      (value instanceof BigNumber && (value.toNumber() === 0 || value.isNaN()))
    )
  )
    number = new BigNumber(value);
  const code = currencyCode?.toUpperCase?.() ?? currencyCode;

  let formatter = currencyFormatterCache[code];
  if (!formatter) {
    formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: code,
      currencyDisplay: 'symbol',
    });
    currencyFormatterCache[code] = formatter;
  }

  return formatter.format(number.toNumber());
};

export const getFiatUnit = (currencyCode: string) => {
  const code = currencyCode?.toUpperCase?.() ?? currencyCode;
  let formatter = currencyFormatterCache[code];
  if (!formatter) {
    formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: code,
      currencyDisplay: 'symbol',
    });
    currencyFormatterCache[code] = formatter;
  }

  const parts = formatter.formatToParts(0);
  const symbolPart = parts.find(p => p.type === 'currency');
  return {
    abbr: code,
    symbol: symbolPart ? symbolPart.value : code,
    decimal: 2,
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _getUnitCache = new Map<string, any>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _getDefaultUnitCache = new Map<string, any>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _getZeroUnitCache = new Map<string, any>();

export const __resetUnitCacheForTests = () => {
  _getUnitCache.clear();
  _getDefaultUnitCache.clear();
  _getZeroUnitCache.clear();
};

export const getUnit = (coinId: string, unitAbbr: string, assetId?: string) => {
  const cacheKey = `${coinId}|${assetId ?? ''}|${unitAbbr}`;
  const cached = _getUnitCache.get(cacheKey);
  if (cached !== undefined) return cached;

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

  _getUnitCache.set(cacheKey, unit);
  return unit;
};

export const getDefaultUnit = (coinId: string, assetId?: string) => {
  const cacheKey = `${coinId}|${assetId ?? ''}`;
  const cached = _getDefaultUnitCache.get(cacheKey);
  if (cached !== undefined) return cached;

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

  _getDefaultUnitCache.set(cacheKey, unit);
  return unit;
};

export const getZeroUnit = (coinId: string, assetId?: string) => {
  const cacheKey = `${coinId}|${assetId ?? ''}`;
  const cached = _getZeroUnitCache.get(cacheKey);
  if (cached !== undefined) return cached;

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

  _getZeroUnitCache.set(cacheKey, unit);
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

  return {
    amount: formatDisplayAmount(amount).complete,
    unit,
  };
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
