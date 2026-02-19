import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
const {
  BtcIdMap,
  EvmIdMap,
  SolanaIdMap,
  NearIdMap,
  XrpIdMap,
  StellarIdMap,
  SiaIdMap,
  CantonIdMap,
} = require('@cypherock/coins');
const { getAssetOrUndefined } = require('@cypherock/coin-support-utils');
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
  XrpIcon,
  HyperliquidIcon,
  BaseIcon,
  StellarIcon,
  SiacoinIcon,
  CantonIcon,
} from '../ui/icons';
import { useTheme } from '../ui';
import Svg, {
  SvgProps,
  Image as SvgImage,
  Circle,
  G,
} from 'react-native-svg';

const coinToIconMap: Record<string, React.FC<SvgProps>> = {
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
  [EvmIdMap.hyperliquid]: HyperliquidIcon,
  [EvmIdMap.base]: BaseIcon,
  [NearIdMap.near]: NearIcon,
  [SolanaIdMap.solana]: SolanaIcon,
  [XrpIdMap.xrp]: XrpIcon,
  [StellarIdMap.stellar]: StellarIcon,
  [SiaIdMap.sia]: SiacoinIcon,
  [CantonIdMap.canton]: CantonIcon,
};

const fallbackIcon = `https://static.cypherock.com/images/fallback-crypto-icon.png`;

const requestErc20ImageFile = (id: string) =>
  `https://static.cypherock.com/images/erc20-by-id/${id}.png`;

const CbtcTokenIcon: React.FC<SvgProps> = props => (
  <Svg viewBox="0 0 96 96" {...props}>
    <SvgImage
      x={0}
      y={0}
      width="100%"
      height="100%"
      href={requestErc20ImageFile('bitcoin')}
      preserveAspectRatio="xMidYMid slice"
    />
  </Svg>
);

const UsdcxTokenIcon: React.FC<SvgProps> = props => (
  <Svg viewBox="0 0 96 96" {...props}>
    <SvgImage
      x={0}
      y={0}
      width="100%"
      height="100%"
      href={requestErc20ImageFile('usd-coin')}
      preserveAspectRatio="xMidYMid slice"
    />
  </Svg>
);

const SbcTokenIcon: React.FC<SvgProps> = props => (
  <Svg viewBox="0 0 400 400" {...props}>
    <G transform="translate(200,200)">
      <Circle r={200} fill="#6938EF" />
      <Circle r={175} fill="#8760F2" />
      <Circle r={150} fill="#A588F5" />
      <Circle r={125} fill="#C3AFF9" />
      <Circle r={100} fill="#E1D7FC" />
      <Circle r={75} fill="#FFFFFF" />
      <Circle r={50} fill="#6938EF" />
    </G>
  </Svg>
);

const tokenToIconMap: Record<string, React.FC<SvgProps> | undefined> = {
  [`${CantonIdMap.canton}:CBTC`]: CbtcTokenIcon,
  [`${CantonIdMap.canton}:USDCx`]: UsdcxTokenIcon,
  [`${CantonIdMap.canton}:SBC`]: SbcTokenIcon,
};

const getCoinIcon = (assetId?: string): React.FC<SvgProps> | undefined => {
  if (!assetId) return undefined;
  return coinToIconMap[assetId];
};

const getTokenIcon = (assetId?: string): React.FC<SvgProps> | undefined => {
  if (!assetId) return undefined;
  return tokenToIconMap[assetId];
};

const getErc20Image = (parentAssetId: string, assetId?: string) => {
  const asset = getAssetOrUndefined(parentAssetId, assetId);
  if (!asset) return fallbackIcon;
  return requestErc20ImageFile(asset.coinGeckoId);
};

interface FallbackImageProps {
  source: { uri: string };
  fallbackUri: string;
  style: any;
  width: number;
  height: number;
}

const FallbackImage: React.FC<FallbackImageProps> = ({
  source,
  fallbackUri,
  style,
  width,
  height,
}) => {
  const [imgSrc, setImgSrc] = useState(source.uri);

  useEffect(() => {
    setImgSrc(source.uri);
  }, [source.uri]);

  return (
    <Image
      source={{ uri: imgSrc }}
      onError={() => setImgSrc(fallbackUri)}
      style={[style, { width, height }]}
    />
  );
};

interface CoinIconProps {
  assetId?: string;
  parentAssetId: string;
  size?: number;
  subContainerSize?: number;
  subIconSize?: number;
  withBackground?: boolean;
  withSubIconAtBottom?: boolean;
  withParentIconAtBottom?: boolean;
}

export const CoinIcon: React.FC<CoinIconProps> = ({
  parentAssetId,
  assetId,
  size = 20,
  subIconSize,
  subContainerSize,
  withBackground,
  withSubIconAtBottom,
  withParentIconAtBottom,
}) => {
  const Icon = getCoinIcon(parentAssetId);
  const theme = useTheme();

  const containerStyle = {
    ...styles.container,
    width: size,
    height: size,
    backgroundColor: withBackground
      ? theme.palette.background.secondary
      : 'transparent',
  };

  const iconStyle = {
    ...styles.icon,
  };

  const iconSize = {
    width: size,
    height: size,
  };

  const defaultSubIconSize = 10;
  const defaultSubContainerSize = 14;

  const subContainerStyle = {
    ...styles.subContainer,
    width: subContainerSize ?? defaultSubContainerSize,
    height: subContainerSize ?? defaultSubContainerSize,
  };

  const subIconStyle = {
    ...styles.subIcon,
  };

  const renderSingleImage = (uri: string) => (
    <View style={containerStyle}>
      <FallbackImage
        source={{ uri }}
        fallbackUri={fallbackIcon}
        style={iconStyle}
        width={iconSize.width}
        height={iconSize.height}
      />
    </View>
  );

  const renderDualIcon = (
    mainElement: React.ReactNode,
    subElement: React.ReactNode,
  ) => (
    <View style={containerStyle}>
      {mainElement}
      <View style={subContainerStyle}>{subElement}</View>
    </View>
  );

  const renderDualIconWithAsset = (
    tokenImageUri: string,
    IconComponent: React.FC<SvgProps>,
  ) => {
    if (withSubIconAtBottom) {
      return renderDualIcon(
        <IconComponent
          width={iconSize.width}
          height={iconSize.height}
          style={iconStyle}
        />,
        <FallbackImage
          source={{ uri: tokenImageUri }}
          fallbackUri={fallbackIcon}
          style={subIconStyle}
          width={subIconSize ?? defaultSubIconSize}
          height={subIconSize ?? defaultSubIconSize}
        />,
      );
    }

    if (withParentIconAtBottom) {
      return renderDualIcon(
        <FallbackImage
          source={{ uri: tokenImageUri }}
          fallbackUri={fallbackIcon}
          style={iconStyle}
          width={iconSize.width}
          height={iconSize.height}
        />,
        <IconComponent
          width={subIconSize ?? defaultSubIconSize}
          height={subIconSize ?? defaultSubIconSize}
          style={subIconStyle}
        />,
      );
    }

    return undefined;
  };

  const isCanton = parentAssetId === CantonIdMap.canton;
  const hasDifferentAssetId = parentAssetId !== assetId;
  const erc20Image =
    hasDifferentAssetId && !isCanton
      ? getErc20Image(parentAssetId, assetId)
      : null;

  const shouldRenderErc20 =
    !Icon ||
    (assetId &&
      hasDifferentAssetId &&
      !withSubIconAtBottom &&
      !withParentIconAtBottom);

  if (shouldRenderErc20 && erc20Image) {
    return renderSingleImage(erc20Image);
  }

  if (hasDifferentAssetId && erc20Image && Icon) {
    const dualIconResult = renderDualIconWithAsset(erc20Image, Icon);
    if (dualIconResult) {
      return dualIconResult;
    }
  }

  if (hasDifferentAssetId && isCanton) {
    const TokenIcon = getTokenIcon(assetId);
    if (TokenIcon) {
      return (
        <View style={containerStyle}>
          <TokenIcon
            width={iconSize.width}
            height={iconSize.height}
            style={iconStyle}
          />
        </View>
      );
    }
  }

  if (!Icon) {
    return renderSingleImage(fallbackIcon);
  }

  return (
    <View style={containerStyle}>
      <Icon width={iconSize.width} height={iconSize.height} style={iconStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  icon: {
    position: 'absolute',
  },
  subContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 50,
    backgroundColor: '#27221D',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  subIcon: {
    position: 'absolute',
  },
});
