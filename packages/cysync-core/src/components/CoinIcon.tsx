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
  subContainerSize?: MediaQuery<string | number>;
  subIconSize?: MediaQuery<string | number>;
  size?: MediaQuery<string | number>;
  width?: MediaQuery<string | number>;
  height?: MediaQuery<string | number>;
  withSubIconAtBottom?: boolean;
  withParentIconAtBottom?: boolean;
  containerProps?: UtilsProps;
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

const fallbackIcon = `https://static.cypherock.com/images/fallback-crypto-icon.png`;

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
  subContainerSize,
  containerProps: containerUtilsProps,
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
    ...containerUtilsProps,
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
  const defaultSubContainerSize = '21px';

  const subContainerProps: ContainerProps = {
    $bgColor: 'calendar',
    position: 'absolute',
    bottom: withBackground ? 0.05 : -0.1,
    right: withBackground ? 0.05 : 0,
    $borderRadius: '50%',
    $borderWidth: 0,
    width: subContainerSize ?? defaultSubContainerSize,
    height: subContainerSize ?? defaultSubContainerSize,
  };

  const subIconProps: UtilsProps = {
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
          fallbackSrc={fallbackIcon}
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
        <Container {...subContainerProps}>
          <Image
            src={requestErc20ImageFile(
              getAsset(parentAssetId, assetId).coinGeckoId,
            )}
            fallbackSrc={fallbackIcon}
            alt={getAsset(parentAssetId, assetId).name}
            {...subIconProps}
          />
        </Container>
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
          fallbackSrc={fallbackIcon}
          alt={getAsset(parentAssetId, assetId).name}
          {...iconProps}
        />
        <Container {...subContainerProps}>
          <Icon {...subIconProps} />
        </Container>
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
  subContainerSize: undefined,
  withSubIconAtBottom: undefined,
  withParentIconAtBottom: undefined,
  subIconSize: undefined,
  containerProps: undefined,
};
