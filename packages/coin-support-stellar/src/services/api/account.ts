import { stellarCoinList } from '@cypherock/coins';
import { BigNumber, makePostRequest } from '@cypherock/cysync-utils';

import { getReserveBalance } from './chain';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/stellar/wallet`;

export const getAccountInfo = async (
  address: string,
  assetId: string,
): Promise<any> => {
  const url = `${baseURL}/account-info`;
  const response = await makePostRequest(url, {
    address,
    network: stellarCoinList[assetId].network,
  });

  return response.data?.account_info;
};

export const getBalance = async (
  address: string,
  assetId: string,
): Promise<string> => {
  const accountInfo = await getAccountInfo(address, assetId);
  let balance = accountInfo?.balances?.[0]?.balance ?? '0';
  if (typeof balance === 'number') balance = balance.toString();

  if (typeof balance !== 'string')
    throw new Error('Invalid stellar balance returned from server');

  return balance;
};

export const getSequence = async (
  address: string,
  assetId: string,
): Promise<number> => {
  const accountInfo = await getAccountInfo(address, assetId);

  if (!accountInfo)
    throw new Error('Failed to fetch stellar account info from server');

  // Fix: Use correct field from actual API response
  const sequence = accountInfo?.sequence;

  if (sequence === undefined || sequence === null)
    throw new Error('Invalid stellar sequence returned from server');

  const parsedSequence = Number(sequence);
  return parsedSequence;
};

export const getIsAccountActivated = async (
  address: string,
  assetId: string,
): Promise<boolean> => {
  const accountInfo = await getAccountInfo(address, assetId);

  const isActivated = Boolean(
    accountInfo?.balances?.[0]?.balance &&
      accountInfo.balances[0].balance !== '0',
  );
  return isActivated;
};

export const getAccountReserveBalance = async (
  address: string,
  assetId: string,
): Promise<string> => {
  const { reserveBaseBalance, reserveIncBalance } = await getReserveBalance(
    assetId,
  );

  const accountInfo = await getAccountInfo(address, assetId);

  const ownerCount = accountInfo?.subentry_count ?? 0;

  let reserveBalance = new BigNumber(reserveBaseBalance);
  if (ownerCount)
    reserveBalance = reserveBalance.plus(
      new BigNumber(reserveIncBalance).multipliedBy(ownerCount),
    );

  const finalReserve = reserveBalance.toString();
  return finalReserve;
};
