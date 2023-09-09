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
} from '@cypherock/cysync-ui';
import { HeightProps } from '@cypherock/cysync-ui/src/components/utils';
import React from 'react';

export interface CoinIconProps {
  assetId: string;
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

export const getCoinIcon = (
  assetId: string,
): React.FC<IconProps> | undefined => {
  const Icon = coinToIconMap[assetId];

  return Icon;
};

export const CoinIcon: React.FC<CoinIconProps> = ({
  assetId,
  size,
  width,
  height,
}) => {
  const Icon = getCoinIcon(assetId);

  if (!Icon) {
    return null;
  }

  const parsedWidth = width ?? size;
  const parsedHeight = height ?? size;

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
  width: undefined,
  height: undefined,
};
