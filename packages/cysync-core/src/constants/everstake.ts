import { EvmIdMap } from '@cypherock/coins';

export interface IEverstakeAsset {
  parentAssetId: string;
  assetId: string;
}

export const EVERSTAKE_ASSETS: IEverstakeAsset[] = [
  { parentAssetId: EvmIdMap.ethereum, assetId: EvmIdMap.ethereum },
];
