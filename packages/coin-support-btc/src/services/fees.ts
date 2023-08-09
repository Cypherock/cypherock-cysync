import { IBtcCoinInfo } from '@cypherock/coins';
import { assert } from '@cypherock/cysync-utils';
import axios from 'axios';

import { config } from '../config';

const baseURL = `${config.API_CYPHEROCK}/transaction`;

export const getAverageFee = async (coin: IBtcCoinInfo): Promise<number> => {
  const url = `${baseURL}/fees`;
  const response = await axios.post(url, {
    coinType: coin.apiCoinType,
  });

  assert(
    response.data.medium_fee_per_kb,
    new Error('Server: Invalid fees result from server'),
  );

  return Math.round(response.data.medium_fee_per_kb / 1024);
};
