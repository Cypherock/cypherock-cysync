import { IValidateAddressParams } from '@cypherock/coin-support-interfaces';
import { icpCoinList } from '@cypherock/coins';
import { assert } from '@cypherock/cysync-utils';

export const validateAddress = (params: IValidateAddressParams) => {
  const { address, coinId } = params;
  const coin = icpCoinList[coinId];

  assert(coin, new Error(`Cannot find coin details for coin: ${coinId}`));

  return /^[0-9a-fA-F]{64}$/.test(address);
};
