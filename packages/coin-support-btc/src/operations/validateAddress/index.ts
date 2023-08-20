import { btcCoinList, BtcIdMap, BtcId, ICoinInfo } from '@cypherock/coins';
import { assert } from '@cypherock/cysync-utils';
import WAValidator from 'multicoin-address-validator';

type AddressValidator = (address: string, coin: ICoinInfo) => boolean;

const createMultiCoinValidator =
  (coinName: string): AddressValidator =>
  (address, coin) =>
    WAValidator.validate(address, coinName, coin.isTest ? 'testnet' : 'prod');

const coinFamilyToValidatorMap: Record<BtcId, AddressValidator> = {
  [BtcIdMap.bitcoin]: createMultiCoinValidator('btc'),
  [BtcIdMap.litecoin]: createMultiCoinValidator('ltc'),
  [BtcIdMap.dogecoin]: createMultiCoinValidator('doge'),
  [BtcIdMap.dash]: createMultiCoinValidator('dash'),
};

export const validateAddress = (params: {
  address: string;
  coinId: string;
}) => {
  const { address, coinId } = params;
  const coin = btcCoinList[coinId];

  assert(coin, new Error(`Cannot find coin details for coin: ${coinId}`));

  return coinFamilyToValidatorMap[coin.id as BtcId](address, coin);
};
