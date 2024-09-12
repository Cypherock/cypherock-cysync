import { makePostRequestWithValidation } from '@cypherock/cysync-utils';

import {
  getCryptoNetworksResultSchema,
  getTradingPairsResultSchema,
} from './schema';

import { config } from '../../config';

export { type BinanceGetTradingPairsResponse } from './schema';

const baseURL = `${config.API_CYPHEROCK}/v1/buy/binance`;

const getTradingPairs = async () => {
  const url = `${baseURL}/trading-pairs`;
  const response = await makePostRequestWithValidation(
    getTradingPairsResultSchema,
    url,
  );

  return response.data;
};

const getCryptoNetworks = async () => {
  const url = `${baseURL}/crypto-network`;
  const response = await makePostRequestWithValidation(
    getCryptoNetworksResultSchema,
    url,
  );
  return response.data;
};

export const binanceService = {
  getTradingPairs,
  getCryptoNetworks,
};
