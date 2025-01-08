import { makePostRequest } from '@cypherock/cysync-utils';
import { config } from '../../config';
import { starknetCoinList } from '@cypherock/coins';

const baseUrl = `${config.API_CYPHEROCK}/starknet/chain`;

export const getChainId = async (assetId: string): Promise<string> => {
  const url = `${baseUrl}/chainId`;

  const response = await makePostRequest(url, {
    network: starknetCoinList[assetId].network,
  });

  return response.data.result;
};
