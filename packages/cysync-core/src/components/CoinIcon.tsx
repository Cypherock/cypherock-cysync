import { getAsset } from '@cypherock/coin-support-utils';
import { BtcIdMap, EvmIdMap, SolanaIdMap, NearIdMap } from '@cypherock/coins';
import {
  ContainerProps,
  Container,
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
  Image,
  UtilsProps,
} from '@cypherock/cysync-ui';
import React from 'react';

export interface CoinIconProps {
  withBackground?: boolean;
  assetId?: string;
  parentAssetId: string;
  containerSize?: MediaQuery<string | number>;
  subIconSize?: MediaQuery<string | number>;
  size?: MediaQuery<string | number>;
  width?: MediaQuery<string | number>;
  height?: MediaQuery<string | number>;
  withSubIconAtBottom?: boolean;
  withParentIconAtBottom?: boolean;
}

type IconProps = UtilsProps;

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
  containerSize,
  width,
  height,
  withBackground,
  withSubIconAtBottom,
  withParentIconAtBottom,
  subIconSize,
}) => {
  const Icon = getCoinIcon(parentAssetId);

  const parsedWidth = width ?? size;
  const parsedHeight = height ?? size;

  const containerProps: ContainerProps = {
    $bgColor: withBackground ? 'calendar' : undefined,
    position: 'relative',
    $borderRadius: withBackground ? 8 : undefined,
    $borderWidth: 0,
    width: containerSize ?? parsedWidth,
    height: containerSize ?? parsedHeight,
  };

  const iconProps: UtilsProps = {
    position: 'absolute',
    top: 0.5,
    left: 0.5,
    $translateX: -0.5,
    $translateY: -0.5,
    $width: parsedWidth,
    $height: parsedHeight,
    $minWidth: parsedWidth,
    $minHeight: parsedHeight,
  };

  const defaultSubIconSize = '20px';

  const subIconProps: UtilsProps = {
    position: 'absolute',
    bottom: 0.18,
    right: 0.25,
    $translateX: 0.5,
    $translateY: 0.5,
    $width: subIconSize ?? defaultSubIconSize,
    $height: subIconSize ?? defaultSubIconSize,
    $minWidth: subIconSize ?? defaultSubIconSize,
    $minHeight: subIconSize ?? defaultSubIconSize,
  };

  if (
    !Icon ||
    (assetId &&
      assetId !== parentAssetId &&
      !withSubIconAtBottom &&
      !withParentIconAtBottom)
  ) {
    const asset = getAsset(parentAssetId, assetId);

    return (
      <Container {...containerProps}>
        <Image
          src={requestErc20ImageFile(asset.coinGeckoId)}
          alt={asset.name}
          {...iconProps}
        />
      </Container>
    );
  }

  if (withSubIconAtBottom && parentAssetId !== assetId) {
    return (
      <Container {...containerProps}>
        <Icon {...iconProps} />
        <Image
          src={requestErc20ImageFile(
            getAsset(parentAssetId, assetId).coinGeckoId,
          )}
          alt={getAsset(parentAssetId, assetId).name}
          {...subIconProps}
        />
      </Container>
    );
  }

  if (withParentIconAtBottom && parentAssetId !== assetId) {
    return (
      <Container {...containerProps}>
        <Image
          src={requestErc20ImageFile(
            getAsset(parentAssetId, assetId).coinGeckoId,
          )}
          alt={getAsset(parentAssetId, assetId).name}
          {...iconProps}
        />
        <Icon {...subIconProps} />
      </Container>
    );
  }

  return (
    <Container {...containerProps}>
      <Icon {...iconProps} />
    </Container>
  );
};

CoinIcon.defaultProps = {
  size: '20px',
  assetId: undefined,
  width: undefined,
  height: undefined,
  withBackground: undefined,
  containerSize: undefined,
  withSubIconAtBottom: undefined,
  withParentIconAtBottom: undefined,
  subIconSize: undefined,
};
