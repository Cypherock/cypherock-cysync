import axios from 'axios';

import { config } from '../config';
import { getAsset } from '../db';
import { downsamplePricePairs } from '../utils/resamplePriceHistory';

const baseURL = `${config.API_CYPHEROCK}/price`;

export const getLatestPrices = async (
  coinIds: { parentAssetId: string; assetId: string }[],
  currency: string,
): Promise<{ assetId: string; price: number }[]> => {
  const coinGeckoIds = coinIds
    .filter(id => !getAsset(id.parentAssetId, id.assetId).isZeroPriceCoin)
    .map(id => getAsset(id.parentAssetId, id.assetId).coinGeckoId);

  const vsCurrencies = currency === 'usd' ? [currency] : ['usd', currency];
  const response = await axios.post(`${baseURL}/current`, {
    vsCurrencies,
    ids: coinGeckoIds,
  });

  const result: { assetId: string; price: number }[] = coinIds
    .filter(
      id =>
        response.data.data[
          getAsset(id.parentAssetId, id.assetId).coinGeckoId
        ]?.[currency] !== undefined,
    )
    .map(id => ({
      assetId: id.assetId,
      price: getAsset(id.parentAssetId, id.assetId).isZeroPriceCoin
        ? 0
        : response.data.data[
            getAsset(id.parentAssetId, id.assetId).coinGeckoId
          ][currency],
    }));

  return result;
};

/**
 * Fetches the price history for a coin. The API always responds with its
 * native granularity (e.g. ~720 hourly points for 30 days) and rejects any
 * granularity parameter, so when `maxDataPoints` is given the series is
 * downsampled here — at the fetch boundary — before anything else sees it.
 */
export const getPriceHistory = async (
  coinId: { parentAssetId: string; assetId: string },
  currency: string,
  days: number,
  maxDataPoints?: number,
): Promise<number[][]> => {
  const { coinGeckoId, isZeroPriceCoin } = getAsset(
    coinId.parentAssetId,
    coinId.assetId,
  );

  if (isZeroPriceCoin) {
    return [];
  }

  const url = `${baseURL}/history`;

  const response = await axios.post(url, {
    id: coinGeckoId,
    vsCurrency: currency,
    days,
  });

  const prices: number[][] = response.data.data ?? [];

  if (maxDataPoints === undefined) return prices;

  return downsamplePricePairs(prices, maxDataPoints);
};
