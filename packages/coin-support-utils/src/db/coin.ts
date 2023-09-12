import { coinList, IEvmCoinInfo } from '@cypherock/coins';

export const getAsset = (parentId: string, assetId?: string) => {
  const coin = coinList[parentId];

  if (assetId && parentId !== assetId) {
    const token = (coin as IEvmCoinInfo).tokens[assetId];
    return token;
  }

  return coin;
};
