import { solanaCoinList } from '@cypherock/coins';
import { makePostRequest } from '@cypherock/cysync-utils';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/solana/wallet`;

export const getBalance = async (address: string, assetId: string) => {
  const accountInfo = await getAccountInfo(address, assetId);

  let balance = accountInfo?.value?.lamports ?? '0';

  if (typeof balance === 'number') balance = balance.toString();

  if (typeof balance !== 'string')
    throw new Error('Invalid solana balance returned from server');

  return balance;
};

export const getAccountInfo = async (address: string, assetId: string) => {
  const url = `${baseURL}/account-info`;
  const response = await makePostRequest(url, {
    address,
    network: solanaCoinList[assetId].network,
    responseType: 'v2',
  });

  return response.data;
};

export const getTokenBalance = async (address: string, assetId: string) => {
  const accountInfo = await getAccountInfo(address, assetId);

  let balance =
    accountInfo?.value?.data?.parsed?.info?.tokenAmount?.amount ?? '0';

  if (typeof balance === 'number') balance = balance.toString();

  if (typeof balance !== 'string')
    throw new Error('Invalid solana token balance returned from server');

  return balance;
};
