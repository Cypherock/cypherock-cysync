import { stellarCoinList } from '@cypherock/coins';
import { makePostRequest } from '@cypherock/cysync-utils';

import { config } from '../../config';

const baseURL = `${config.API_CYPHEROCK}/stellar/chain`;

export const getReserveBalance = async (
  assetId: string,
): Promise<{
  reserveBaseBalance: string;
  reserveIncBalance: string;
}> => {
  try {
    const url = `${baseURL}/reserve-balance`;
    const response = await makePostRequest(url, {
      network: stellarCoinList[assetId].network,
    });

    const { reserveBaseBalance, reserveIncBalance } = response.data;

    if (reserveBaseBalance && reserveIncBalance) {
      return { reserveBaseBalance, reserveIncBalance };
    }

    throw new Error('Invalid response');
  } catch (error) {
    return {
      reserveBaseBalance: '10000000', // 1 XLM
      reserveIncBalance: '5000000', // 0.5 XLM
    };
  }
};
