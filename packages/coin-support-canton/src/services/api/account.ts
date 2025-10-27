// import { cantonCoinList } from '@cypherock/coins';
import { makePostRequest } from '@cypherock/cysync-utils';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/canton/wallet`;

export const getAccountInfo = async (
  address: string,
  assetId: string,
): Promise<any> => {
  // const url = `${baseURL}/account-info`;
  // const response = await makePostRequest(url, {
  //   address,
  //   network: cantonCoinList[assetId].network,
  // });

  console.log(`Getting Account Info for ${assetId}:${address}`);

  return { balance: '0' };
};

export const getBalance = async (
  partyId: string,
  assetId: string,
): Promise<string> => {
  console.log(`Getting Balance for ${partyId}:${assetId}`);
  const url = `${baseURL}/balance`;
  const response = await makePostRequest(url, {
    partyId,
  });

  let balance = response.data?.balance ?? '0';

  if (typeof balance === 'number') balance = balance.toString();

  if (typeof balance !== 'string')
    throw new Error('Invalid canton balance returned from server');

  return balance;
};

export const getIsAccountCreated = async (
  partyId: string,
  assetId: string,
): Promise<boolean> => {
  try {
    console.log(`Getting Is Account Created for ${partyId}:${assetId}`);
    const url = `${baseURL}/balance`;
    const response = await makePostRequest(url, {
      partyId,
    });

    if (!response.data?.balance) return false;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
