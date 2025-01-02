import { IValidateAddressParams } from '@cypherock/coin-support-interfaces';
import { starknetCoinList } from '@cypherock/coins';
import { assert } from '@cypherock/cysync-utils';

import { getCoinSupportStarknetLib } from '../../utils';

export const validateAddress = (params: IValidateAddressParams) => {
  const { address, coinId } = params;
  const coin = starknetCoinList[coinId];

  assert(coin, new Error(`Cannot find coin details for coin: ${coinId}`));

  try {
    getCoinSupportStarknetLib().validateAndParseAddress(address);
    return true;
  } catch (error) {
    return false;
  }
};
