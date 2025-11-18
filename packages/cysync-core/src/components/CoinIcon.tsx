import { getAssetOrUndefined } from '@cypherock/coin-support-utils';
import {
  BtcIdMap,
  EvmIdMap,
  SolanaIdMap,
  NearIdMap,
  XrpIdMap,
  StellarIdMap,
  SiaIdMap,
  CantonIdMap,
} from '@cypherock/coins';
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
  HyperliquidIcon,
  SolanaIcon,
  NearIcon,
  XrpIcon,
  MediaQuery,
  Image,
  UtilsProps,
  StellarIcon,
  SiacoinIcon,
  CantonIcon,
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
  showFallback?: boolean;
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
  [EvmIdMap.hyperliquid]: HyperliquidIcon,
  [EvmIdMap.binance]: BinanceIcon,
  [EvmIdMap.polygon]: PolygonIcon,
  [EvmIdMap.fantom]: FantomIcon,
  [EvmIdMap.avalanche]: AvalancheIcon,
  [NearIdMap.near]: NearIcon,
  [SolanaIdMap.solana]: SolanaIcon,
  [XrpIdMap.xrp]: XrpIcon,
  [StellarIdMap.stellar]: StellarIcon,
  [SiaIdMap.sia]: SiacoinIcon,
  [CantonIdMap.canton]: CantonIcon,
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

interface IconPropsConfig {
  containerProps: ContainerProps;
  iconProps: UtilsProps;
  subContainerProps: ContainerProps;
  subIconProps: UtilsProps;
}

const calculateIconProps = (
  size: MediaQuery<string | number> | undefined,
  width: MediaQuery<string | number> | undefined,
  height: MediaQuery<string | number> | undefined,
  containerSize: MediaQuery<string | number> | undefined,
  subIconSize: MediaQuery<string | number> | undefined,
  subContainerSize: MediaQuery<string | number> | undefined,
  withBackground: boolean | undefined,
  containerUtilsProps: UtilsProps | undefined,
): IconPropsConfig => {
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

  return {
    containerProps,
    iconProps,
    subContainerProps,
    subIconProps,
  };
};

const getErc20Image = (parentAssetId: string, assetId?: string) => {
  const asset = getAssetOrUndefined(parentAssetId, assetId);

  if (!asset) {
    return {
      src: fallbackIcon,
      alt: assetId ?? parentAssetId,
    };
  }

  return {
    src: requestErc20ImageFile(asset.coinGeckoId),
    alt: asset.name,
  };
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
  showFallback,
}) => {
  const Icon = getCoinIcon(parentAssetId);
  const { containerProps, iconProps, subContainerProps, subIconProps } =
    calculateIconProps(
      size,
      width,
      height,
      containerSize,
      subIconSize,
      subContainerSize,
      withBackground,
      containerUtilsProps,
    );

  const renderSingleImage = (src: string, alt: string, withFallback = true) => (
    <Container {...containerProps}>
      <Image
        src={src}
        fallbackSrc={withFallback ? fallbackIcon : undefined}
        alt={alt}
        {...iconProps}
      />
    </Container>
  );

  const renderDualIcon = (
    mainElement: React.ReactNode,
    subElement: React.ReactNode,
  ) => (
    <Container {...containerProps}>
      {mainElement}
      <Container {...subContainerProps}>{subElement}</Container>
    </Container>
  );

  const renderDualIconWithAsset = (
    erc20Image: { src: string; alt: string },
    IconComponent: React.FC<IconProps>,
  ) => {
    if (withSubIconAtBottom) {
      return renderDualIcon(
        <IconComponent {...iconProps} />,
        <Image
          src={erc20Image.src}
          fallbackSrc={fallbackIcon}
          alt={erc20Image.alt}
          {...subIconProps}
        />,
      );
    }

    if (withParentIconAtBottom) {
      return renderDualIcon(
        <Image
          src={erc20Image.src}
          fallbackSrc={fallbackIcon}
          alt={erc20Image.alt}
          {...iconProps}
        />,
        <IconComponent {...subIconProps} />,
      );
    }

    return undefined;
  };

  if (showFallback) {
    return renderSingleImage(fallbackIcon, 'fallback', false);
  }

  const hasDifferentAssetId = parentAssetId !== assetId;
  const erc20Image = hasDifferentAssetId
    ? getErc20Image(parentAssetId, assetId)
    : null;

  const shouldRenderErc20 =
    !Icon ||
    (assetId &&
      hasDifferentAssetId &&
      !withSubIconAtBottom &&
      !withParentIconAtBottom);

  if (shouldRenderErc20 && erc20Image) {
    return renderSingleImage(erc20Image.src, erc20Image.alt);
  }

  if (hasDifferentAssetId && erc20Image && Icon) {
    const dualIconResult = renderDualIconWithAsset(erc20Image, Icon);
    if (dualIconResult) {
      return dualIconResult;
    }
  }

  if (!Icon) {
    return renderSingleImage(fallbackIcon, 'fallback', false);
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
  showFallback: undefined,
};
