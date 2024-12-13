import { xrpCoinList } from '@cypherock/coins';
import { BigNumber, makePostRequest } from '@cypherock/cysync-utils';

import { getReserveBalance } from './chain';

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

  if (flags === undefined && flags === null)
    throw new Error('Invalid xrp flags returned from server');

  if (sequence === undefined && flags === null)
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

  return accountInfo?.Balance && accountInfo.Balance !== '0';
};

export const getAccountReserveBalance = async (
  address: string,
  assetId: string,
): Promise<string> => {
  const { reserveBaseBalance, reserveIncBalance } = await getReserveBalance(
    assetId,
  );

  const accountInfo = await getAccountInfo(address, assetId);

  const ownerCount = accountInfo?.OwnerCount ?? 0;

  let reserveBalance = new BigNumber(reserveBaseBalance);
  if (ownerCount)
    reserveBalance = reserveBalance.plus(
      new BigNumber(reserveIncBalance).multipliedBy(ownerCount),
    );

  return reserveBalance.toString();
};
