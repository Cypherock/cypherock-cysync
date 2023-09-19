import { getAsset } from '@cypherock/coin-support-utils';
import { BtcIdMap, EvmIdMap, SolanaIdMap, NearIdMap } from '@cypherock/coins';
import {
  BitcoinIcon,
  DashIcon,
  DogeIcon,
  LitecoinIcon,
  EthereumIcon,
  ArbitrumIcon,
  AvalancheIcon,
  BinanceIcon,
  FantomIcon,
  PolygonIcon,
  OptimismIcon,
  SolanaIcon,
  NearIcon,
  MediaQuery,
  WidthProps,
  Image,
} from '@cypherock/cysync-ui';
import { HeightProps } from '@cypherock/cysync-ui/src/components/utils';
import React from 'react';

export interface CoinIconProps {
  assetId?: string;
  parentAssetId: string;
  size?: MediaQuery<string | number>;
  width?: MediaQuery<string | number>;
  height?: MediaQuery<string | number>;
}

interface IconProps extends WidthProps, HeightProps {}

const coinToIconMap: Record<string, React.FC<IconProps> | undefined> = {
  [BtcIdMap.bitcoin]: BitcoinIcon,
  [BtcIdMap.dash]: DashIcon,
  [BtcIdMap.dogecoin]: DogeIcon,
  [BtcIdMap.litecoin]: LitecoinIcon,
  [EvmIdMap.ethereum]: EthereumIcon,
  [EvmIdMap.arbitrum]: ArbitrumIcon,
  [EvmIdMap.optimism]: OptimismIcon,
  [EvmIdMap.binance]: BinanceIcon,
  [EvmIdMap.polygon]: PolygonIcon,
  [EvmIdMap.fantom]: FantomIcon,
  [EvmIdMap.avalanche]: AvalancheIcon,
  [NearIdMap.near]: NearIcon,
  [SolanaIdMap.solana]: SolanaIcon,
} as Record<string, React.FC<IconProps> | undefined>;

const requestErc20ImageFile = (id: string) =>
  `https://static.cypherock.com/images/erc20-by-id/${id}.png`;

export const getCoinIcon = (
  assetId?: string,
): React.FC<IconProps> | undefined => {
  if (!assetId) return undefined;

  const Icon = coinToIconMap[assetId];

  return Icon;
};

export const CoinIcon: React.FC<CoinIconProps> = ({
  parentAssetId,
  assetId,
  size,
  width,
  height,
}) => {
  const Icon = getCoinIcon(parentAssetId);

  const parsedWidth = width ?? size;
  const parsedHeight = height ?? size;

  if (!Icon || (assetId && assetId !== parentAssetId)) {
    const asset = getAsset(parentAssetId, assetId);

    return (
      <Image
        src={requestErc20ImageFile(asset.coinGeckoId)}
        $width={parsedWidth}
        $height={parsedHeight}
        $minWidth={parsedWidth}
        $minHeight={parsedHeight}
        alt={asset.name}
      />
    );
  }

  return (
    <Icon
      width={parsedWidth}
      height={parsedHeight}
      $minWidth={parsedWidth}
      $minHeight={parsedHeight}
    />
  );
};

CoinIcon.defaultProps = {
  size: '20px',
  assetId: undefined,
  width: undefined,
  height: undefined,
};
