import { EvmIdMap } from '@cypherock/coins';
import { assert } from '@cypherock/cysync-utils';
import axios from 'axios';

import { config } from './config';

const http = axios.create({
  baseURL: config.COINGECKO_URL,
  headers: config.COINGECKO_API_KEY
    ? { x_cg_pro_api_key: config.COINGECKO_API_KEY }
    : undefined,
});

export interface CoingeckoCoinListItem {
  id: string;
  symbol: string;
  name: string;
  platforms?: Record<string, string | undefined>;
}

export const getCoingeckoCoinList = async (): Promise<
  CoingeckoCoinListItem[]
> => {
  const response = await http.get(`/coins/list?include_platform=true`);

  assert(response.data, 'No data returned from coingecko coin list');

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
