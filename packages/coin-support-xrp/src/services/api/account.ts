import { makePostRequest } from '@cypherock/cysync-utils';
import { xrpCoinList } from '@cypherock/coins';

import { config } from '../../config';
import { getCoinSupportXrpLib } from '../../utils';

const baseURL = `${config.API_CYPHEROCK}/xrp/wallet`;

export const getBalance = async (
  address: string,
  assetId: string,
): Promise<string> => {
  const url = `${baseURL}/balance`;
  const response = await makePostRequest(url, {
    address,
    network: xrpCoinList[assetId].network,
  });

  let balance = response.data?.balance ?? '0';

  if (typeof balance === 'number') balance = balance.toString();

  if (typeof balance !== 'string')
    throw new Error('Invalid xrp balance returned from server');

  const xrpBalance = getCoinSupportXrpLib().dropsToXrp(balance).toString();
  return xrpBalance;
};
