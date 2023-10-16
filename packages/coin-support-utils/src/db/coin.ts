import { coinList, IEvmCoinInfo } from '@cypherock/coins';
import { assert } from '@cypherock/cysync-utils';

export const getAsset = (parentId: string, assetId?: string) => {
  const coin = coinList[parentId];

  assert(coin, new Error(`No coin found ${parentId}:${assetId ?? ''}`));

  if (assetId && parentId !== assetId) {
    const token = (coin as IEvmCoinInfo).tokens[assetId];
    assert(token, new Error(`No token found for coin ${parentId}:${assetId}`));
    return token;
  }

  return coin;
};
