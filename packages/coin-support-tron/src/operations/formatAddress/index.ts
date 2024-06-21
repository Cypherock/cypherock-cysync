import { IFormatAddressParams } from '@cypherock/coin-support-interfaces';
import { tronCoinList } from '@cypherock/coins';
import { assert } from '@cypherock/cysync-utils';

import { getCoinSupportTronWeb } from '../../utils';

export const formatAddress = (params: IFormatAddressParams) => {
  const { address, coinId } = params;
  const coin = tronCoinList[coinId];

  assert(coin, new Error(`Cannot find coin details for coin: ${coinId}`));

  const tronWeb = getCoinSupportTronWeb();

  return tronWeb.address.fromHex(tronWeb.address.toHex(address));
};
