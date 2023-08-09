import { btcCoinList } from '@cypherock/coins';
import axios from 'axios';

import { config } from '../../../config';

const baseURL = `${config.API_CYPHEROCK}/v2`;

export interface IUtxo {
  txid: string;
  vout: number;
  value: string;
  confirmations: number;
  lockTime?: number;
  height: number;
  address: string;
  path: string;
}

export const getUtxos = async (params: {
  xpub: string;
  coinId: string;
}): Promise<IUtxo[]> => {
  const coin = btcCoinList[params.coinId];

  const url = `${baseURL}/utxo`;
  const response = await axios.post(url, {
    xpub: params.xpub,
    coinType: coin.apiCoinType,
  });

  return response.data;
};
