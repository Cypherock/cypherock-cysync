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

export const doesAccountExist = async (address: string, assetId: string) => {
  const accountInfo = await getAccountInfo(address, assetId);

  // if account doesn't exist accountInfo.value comes null
  return accountInfo.value !== undefined && accountInfo.value !== null;
};

export const getAccountDataLength = async (
  address: string,
  assetId: string,
) => {
  const accountInfo = await getAccountInfo(address, assetId);

  let dataLength = 0;
  if (Array.isArray(accountInfo.value?.data)) {
    // for native account
    dataLength = accountInfo.value.data[0].length ?? 0;
  } else if (typeof accountInfo.value?.data === 'object') {
    // for token account
    dataLength = accountInfo.value.data.space ?? 0;
  }

  return dataLength;
};
