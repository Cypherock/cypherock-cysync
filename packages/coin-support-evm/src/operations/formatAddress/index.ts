import { IFormatAddressParams } from '@cypherock/coin-support-interfaces';
import { evmCoinList } from '@cypherock/coins';
import { assert } from '@cypherock/cysync-utils';

import { getCoinSupportEthersLib } from '../../utils';

export const formatAddress = (params: IFormatAddressParams) => {
  const { address, coinId } = params;
  const coin = evmCoinList[coinId];

  assert(coin, new Error(`Cannot find coin details for coin: ${coinId}`));

  const ethers = getCoinSupportEthersLib();

  return ethers.getAddress(address);
};
