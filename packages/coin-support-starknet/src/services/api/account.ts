import { starknetCoinList } from '@cypherock/coins';
import { makePostRequest } from '@cypherock/cysync-utils';

import { config } from '../../config';
import { getCoinSupportStarknetLib } from '../../utils';

const baseURL = `${config.API_CYPHEROCK}/starknet/wallet`;

export const getBalance = async (
  address: string,
  contractAddress: string,
  assetId: string,
): Promise<string> => {
  const url = `${baseURL}/balance`;
  const response = await makePostRequest(url, {
    calldata: [address],
    contractAddress,
    entryPointSelector:
      getCoinSupportStarknetLib().hash.getSelectorFromName('balanceOf'),
    network: starknetCoinList[assetId].network,
  });

  let balance = response?.data?.balance ?? '0';

  if (typeof balance === 'number') balance = balance.toString();

  if (typeof balance !== 'string')
    throw new Error('Invalid starknet balance returned from server');

  return balance;
};
