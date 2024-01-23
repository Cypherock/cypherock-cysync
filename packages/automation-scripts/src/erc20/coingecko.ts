import { EvmIdMap } from '@cypherock/coins';
import { assert } from '@cypherock/cysync-utils';
import axios from 'axios';

import { config } from './config';

const http = axios.create({
  baseURL: config.COINGECKO_URL,
  headers: config.COINGECKO_API_KEY
    ? { 'x-cg-pro-api-key': config.COINGECKO_API_KEY }
    : undefined,
});

export interface CoingeckoCoinListItem {
  id: string;
  symbol: string;
  name: string;
  platforms?: Record<string, string | undefined>;
}

export interface CoingeckoCoinDetails {
  id: string;
  symbol: string;
  name: string;
  detail_platforms?: Record<
    string,
    { decimal_place: number; contract_address: string }
  >;
  market_data?: {
    market_cap?: {
      usd?: number;
    };
  };
  description?: {
    en?: string;
  };
  image?: {
    thumb?: string;
    small?: string;
    large?: string;
  };
  last_updated?: string;
}

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

export const coingeckoPlatformMapping: Record<string, string | undefined> = {
  ethereum: EvmIdMap.ethereum,
  'binance-smart-chain': EvmIdMap.binance,
  avalanche: EvmIdMap.avalanche,
  'optimistic-ethereum': EvmIdMap.optimism,
  'polygon-pos': EvmIdMap.polygon,
  'arbitrum-one': EvmIdMap.arbitrum,
  fantom: EvmIdMap.fantom,
};

export const coingeckoPlatformReverseMapping: Record<
  string,
  string | undefined
> = Object.entries(coingeckoPlatformMapping).reduce(
  (a, v) => ({ ...a, [v[1] ?? '']: v[0] }),
  {},
);
