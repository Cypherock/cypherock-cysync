import axios from 'axios';

import { getAsset } from '..';

// const baseURL = `${config.API_CYPHEROCK}/transaction`;
const baseURL = `https://api.coingecko.com/api/v3`;

export const getLatestPrices = async (
  coinIds: { parentAssetId: string; assetId: string }[],
  currency: string,
): Promise<{ assetId: string; price: number }[]> => {
  const coinGeckoIds = coinIds.map(
    id => getAsset(id.parentAssetId, id.assetId).coinGeckoId,
  );

  const response = await axios.post(`${baseURL}/current`, {
    vsCurrencies: [currency],
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
      price:
        response.data.data[getAsset(id.parentAssetId, id.assetId).coinGeckoId][
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

  const url = `${baseURL}/history`;

  const response = await axios.post(url, {
    id: coinGeckoId,
    vsCurrency: currency,
    days,
  });

  return response.data.data ?? [];
};
