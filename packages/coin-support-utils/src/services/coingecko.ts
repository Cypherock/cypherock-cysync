import { coinList } from '@cypherock/coins';
import axios from 'axios';

// const baseURL = `${config.API_CYPHEROCK}/transaction`;
const baseURL = `https://api.coingecko.com/api/v3`;

export const getLatestPrices = async (
  coinIds: string[],
  currency: string,
): Promise<{ coinId: string; price: number }[]> => {
  const url = `${baseURL}/simple/price`;

  const coinGeckoIds = coinIds.map(id => coinList[id].coinGeckoId);

  const response = await axios.get(
    `${url}?vs_currencies=${currency}&ids=${coinGeckoIds.join(',')}`,
  );

  const result: { coinId: string; price: number }[] = coinIds
    .filter(
      id =>
        response.data[coinList[id].coinGeckoId] &&
        response.data[coinList[id].coinGeckoId][currency] !== undefined,
    )
    .map(id => ({
      coinId: id,
      price: response.data[coinList[id].coinGeckoId][currency],
    }));

  return result;
};
