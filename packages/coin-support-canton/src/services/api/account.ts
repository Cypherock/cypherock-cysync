// import { cantonCoinList } from '@cypherock/coins';
// import { makePostRequest } from '@cypherock/cysync-utils';

// import { config } from '../../config';

// const baseURL = `${config.API_CYPHEROCK}/canton/wallet`;

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
  address: string,
  assetId: string,
): Promise<string> => {
  const accountInfo = await getAccountInfo(address, assetId);

  let balance = accountInfo?.balance ?? '0';

  if (typeof balance === 'number') balance = balance.toString();

  if (typeof balance !== 'string')
    throw new Error('Invalid canton balance returned from server');

  return balance;
};

export const getIsAccountCreated = async (
  address: string,
  assetId: string,
): Promise<boolean> => {
  const accountInfo = await getAccountInfo(address, assetId);

  return accountInfo?.balance && accountInfo.balance !== '0';
};
