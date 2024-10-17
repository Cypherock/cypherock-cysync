import { xrpCoinList } from '@cypherock/coins';
import { makePostRequest } from '@cypherock/cysync-utils';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/xrp/wallet`;

export const getAccountInfo = async (
  address: string,
  assetId: string,
): Promise<any> => {
  const url = `${baseURL}/account-info`;
  const response = await makePostRequest(url, {
    address,
    network: xrpCoinList[assetId].network,
  });

  return response.data?.account_info;
};

export const getBalance = async (
  address: string,
  assetId: string,
): Promise<string> => {
  const accountInfo = await getAccountInfo(address, assetId);

  let balance = accountInfo?.Balance ?? '0';

  if (typeof balance === 'number') balance = balance.toString();

  if (typeof balance !== 'string')
    throw new Error('Invalid xrp balance returned from server');

  return balance;
};

export const getFlagsAndSequence = async (
  address: string,
  assetId: string,
): Promise<{ flags: number; sequence: number }> => {
  const accountInfo = await getAccountInfo(address, assetId);

  if (!accountInfo)
    throw new Error('Failed to fetch xrp account info from server');

  const flags = accountInfo?.Flags;
  const sequence = accountInfo?.Sequence;

  if (flags === undefined)
    throw new Error('Invalid xrp flags returned from server');

  if (sequence === undefined)
    throw new Error('Invalid xrp sequence returned from server');

  return {
    flags,
    sequence,
  };
};

export const getIsAccountActivated = async (
  address: string,
  assetId: string,
): Promise<boolean> => {
  const accountInfo = await getAccountInfo(address, assetId);

  return accountInfo?.balance !== undefined && accountInfo.balance !== '0';
};
