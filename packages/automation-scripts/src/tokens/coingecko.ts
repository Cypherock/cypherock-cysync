import { assert } from '@cypherock/cysync-utils';
import axios from 'axios';

import {
  CoingeckoCoinDetails,
  CoingeckoCoinListItem,
  CoingeckoPlatformMapping,
} from './types';

import { config } from '../config';

const http = axios.create({
  baseURL: config.COINGECKO_URL,
  headers: config.COINGECKO_API_KEY
    ? { 'x-cg-pro-api-key': config.COINGECKO_API_KEY }
    : undefined,
});

export const getCoingeckoCoinList = async (): Promise<
  CoingeckoCoinListItem[]
> => {
  const response = await http.get(`/coins/list?include_platform=true`);

  assert(response.data, 'No data returned from coingecko coin list api');

  return response.data;
};

export const getCoingeckoCoinDetails = async (
  id: string,
): Promise<CoingeckoCoinDetails> => {
  const response = await http.get(
    `/coins/${id}?tickers=false&market_data=true&community_data=false&developer_data=true&sparkline=false`,
  );

  assert(response.data, 'No data returned from coingecko coin api');

  return response.data;
};

export const getCoingeckoPlatformReverseMapping = (
  coingeckoPlatformMapping: CoingeckoPlatformMapping,
): Record<string, string> =>
  Object.entries(coingeckoPlatformMapping).reduce(
    (a, v) => ({ ...a, [v[1] ?? '']: v[0] }),
    {},
  );
