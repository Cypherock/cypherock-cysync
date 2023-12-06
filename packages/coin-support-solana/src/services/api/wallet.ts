import { solanaCoinList } from '@cypherock/coins';
import { makePostRequest } from '@cypherock/cysync-utils';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/solana/wallet`;

export const getBalance = async (address: string, assetId: string) => {
  const url = `${baseURL}/balance`;
  const response = await makePostRequest(url, {
    address,
    network: solanaCoinList[assetId].network,
    responseType: 'v2',
  });

  let balance = response.data?.balance ?? '0';

  if (typeof balance === 'number') balance = balance.toString();

  if (typeof balance !== 'string')
    throw new Error('Invalid solana balance returned from server');

  return balance;
};
