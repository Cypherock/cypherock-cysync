import { assert } from '@cypherock/cysync-utils';
import { IIsAccountDeployedParams } from './types';
import { starknetCoinList } from '@cypherock/coins';
import { getIsAccountDeployed } from '../../services';

export const isAccountDeployed = async (
  params: IIsAccountDeployedParams,
): Promise<boolean> => {
  const { address, coinId } = params;
  const coin = starknetCoinList[coinId];

  assert(coin, new Error(`Cannot find coin details for coin: ${coinId}`));

  return getIsAccountDeployed(address, coinId);
};
