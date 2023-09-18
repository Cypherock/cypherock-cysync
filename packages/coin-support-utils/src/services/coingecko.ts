import axios from 'axios';

import { getAsset } from '../db';

// const baseURL = `${config.API_CYPHEROCK}/transaction`;
const baseURL = `https://api.coingecko.com/api/v3`;

export const getLatestPrices = async (
  coinIds: { parentAssetId: string; assetId: string }[],
  currency: string,
): Promise<{ assetId: string; price: number }[]> => {
  const url = `${baseURL}/simple/price`;

  const coinGeckoIds = coinIds.map(
    id => getAsset(id.parentAssetId, id.assetId).coinGeckoId,
  );

  const response = await axios.get(
    `${url}?vs_currencies=${currency}&ids=${coinGeckoIds.join(',')}`,
  );

  const result: { assetId: string; price: number }[] = coinIds
    .filter(
      id =>
        response.data[getAsset(id.parentAssetId, id.assetId).coinGeckoId]?.[
          currency
        ] !== undefined,
    )
    .map(id => ({
      assetId: id.assetId,
      price:
        response.data[getAsset(id.parentAssetId, id.assetId).coinGeckoId][
          currency
        ],
    }));

  return result;
};

export const getPriceHistory = async (
  coinId: { parentAssetId: string; assetId: string },
  currency: string,
  days: number,
): Promise<number[][]> => {
  const { coinGeckoId } = getAsset(coinId.parentAssetId, coinId.assetId);

  const url = `${baseURL}/coins/${coinGeckoId}/market_chart`;

  const response = await axios.get(
    `${url}?vs_currency=${currency}&days=${days}`,
  );

  return response.data.prices ?? [];
};
