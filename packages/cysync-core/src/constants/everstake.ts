import { createErc20AssetId, EvmIdMap, SolanaIdMap } from '@cypherock/coins';

export type EverstakeAssetKind = 'eth' | 'pol' | 'sol';
export interface IEverstakeAsset {
  kind: EverstakeAssetKind;
  parentAssetId: string;
  assetId: string;
  label: string;
  minStakeAmount: string;
}

export const POL_ERC20_TOKEN_ID = 'polygon-ecosystem-token';
export const POL_ASSET_ID = createErc20AssetId({
  parentAssetId: EvmIdMap.ethereum,
  assetId: POL_ERC20_TOKEN_ID,
});

export const EVERSTAKE_ASSETS: IEverstakeAsset[] = [
  {
    kind: 'eth',
    parentAssetId: EvmIdMap.ethereum,
    assetId: EvmIdMap.ethereum,
    label: 'Ethereum',
    minStakeAmount: '0.01',
  },
  {
    kind: 'pol',
    parentAssetId: EvmIdMap.ethereum,
    assetId: POL_ASSET_ID,
    label: 'POL (ex-MATIC)',
    minStakeAmount: '1',
  },
];

export const EVERSTAKE_SOL_ASSET: IEverstakeAsset = {
  kind: 'sol',
  parentAssetId: SolanaIdMap.solana,
  assetId: SolanaIdMap.solana,
  label: 'Solana',
  minStakeAmount: '1',
};

export const ALL_EVERSTAKE_ASSETS: IEverstakeAsset[] = [
  ...EVERSTAKE_ASSETS,
  EVERSTAKE_SOL_ASSET,
];
