// import { cantonCoinList } from '@cypherock/coins';
import { makePostRequest } from '@cypherock/cysync-utils';

import { getRequestOptions } from './common';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/canton/wallet`;

export const getBalance = async (
  partyId: string,
  assetId: string,
  accessToken: string,
): Promise<string> => {
  console.log(`Getting Balance for ${partyId}:${assetId}`);
  const url = `${baseURL}/balance`;
  const response = await makePostRequest(
    url,
    {
      partyId,
    },
    getRequestOptions(accessToken),
  );

  let balance = response.data?.balance ?? '0';

  if (typeof balance === 'number') balance = balance.toString();

  if (typeof balance !== 'string')
    throw new Error('Invalid canton balance returned from server');

  return balance;
};

export const getIsAccountCreated = async (
  partyId: string,
  assetId: string,
  accessToken: string,
): Promise<boolean> => {
  try {
    console.log(`Getting Is Account Created for ${partyId}:${assetId}`);
    const url = `${baseURL}/balance`;
    const response = await makePostRequest(
      url,
      {
        partyId,
      },
      getRequestOptions(accessToken),
    );

    if (!response.data?.balance) return false;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const isTransferPreApprovalEnabled = async (
  partyId: string,
  assetId: string,
  accessToken: string,
): Promise<boolean> => {
  console.log(`Getting Balance for ${partyId}:${assetId}`);
  const url = `${baseURL}/transfer-preapproval-status`;
  const response = await makePostRequest(
    url,
    {
      partyId,
    },
    getRequestOptions(accessToken),
  );

  return (
    response.data?.receiverId === partyId &&
    new Date(response.data.expiresAt) > new Date(Date.now())
  );
};
