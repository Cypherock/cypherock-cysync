import { IValidateAddressParams } from '@cypherock/coin-support-interfaces';
import { xrpCoinList } from '@cypherock/coins';
import { assert } from '@cypherock/cysync-utils';
import WAValidator from 'multicoin-address-validator';

export const validateAddress = (params: IValidateAddressParams) => {
  const { address, coinId } = params;
  const coin = xrpCoinList[coinId];

  assert(coin, new Error(`Cannot find coin details for coin: ${coinId}`));

  return WAValidator.validate(address, 'xrp');
};
