import { IBtcCoinInfo } from '@cypherock/coins';
import { assert } from '@cypherock/cysync-utils';
import axios from 'axios';

import { config } from '../config';

const baseURL = `${config.API_CYPHEROCK}/transaction`;

export const broadcastTransactionToBlockchain = async (
  transaction: string,
  coin: IBtcCoinInfo,
): Promise<string> => {
  const url = `${baseURL}/broadcast`;
  const response = await axios.post(url, {
    transaction,
    coinType: coin.apiCoinType,
  });

  assert(
    response.data.tx.hash,
    new Error('Server: Invalid txn hash from server'),
  );

  return response.data.tx.hash;
};
