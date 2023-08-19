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
} from '@cypherock/cysync-ui';
import React from 'react';

export interface CoinIconProps {
  assetId: string;
  size?: string | number;
}

interface IconProps {
  width?: string | number;
  height?: string | number;
}

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
};

export const getCoinIcon = (
  assetId: string,
): React.FC<IconProps> | undefined => {
  const Icon = coinToIconMap[assetId];

  return Icon;
};

export const CoinIcon: React.FC<CoinIconProps> = ({ assetId, size }) => {
  const Icon = getCoinIcon(assetId);

  if (!Icon) {
    return null;
  }

  return <Icon width={size} height={size} />;
};

CoinIcon.defaultProps = {
  size: '20px',
};
