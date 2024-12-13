import { xrpCoinList } from '@cypherock/coins';
import { makePostRequest } from '@cypherock/cysync-utils';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/xrp/chain`;

export const getReserveBalance = async (
  assetId: string,
): Promise<{
  reserveBaseBalance: string;
  reserveIncBalance: string;
}> => {
  const url = `${baseURL}/reserve-balance`;
  const response = await makePostRequest(url, {
    network: xrpCoinList[assetId].network,
  });

  const { reserveBaseBalance, reserveIncBalance } = response.data;

  if (reserveBaseBalance === undefined && reserveBaseBalance === null)
    throw new Error('Invalid xrp reserveBaseBalance returned from server');

  if (reserveIncBalance === undefined && reserveBaseBalance === null)
    throw new Error('Invalid xrp reserveIncBalance returned from server');

  return {
    reserveBaseBalance,
    reserveIncBalance,
  };
};
