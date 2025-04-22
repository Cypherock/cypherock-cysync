import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
const {
  BtcIdMap,
  EvmIdMap,
  SolanaIdMap,
  NearIdMap,
  XrpIdMap,
} = require('@cypherock/coins');
const { getAsset } = require('@cypherock/coin-support-utils');
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
} from '../ui/icons';
import { useTheme } from '../ui';

const coinToIconMap: Record<string, React.FC<any>> = {
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
  [XrpIdMap.xrp]: XrpIcon,
};

const fallbackIcon = `https://static.cypherock.com/images/fallback-crypto-icon.png`;

const requestErc20ImageFile = (id: string) =>
  `https://static.cypherock.com/images/erc20-by-id/${id}.png`;

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
  const Icon = coinToIconMap[parentAssetId];
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

  if (
    !Icon ||
    (assetId &&
      assetId !== parentAssetId &&
      !withSubIconAtBottom &&
      !withParentIconAtBottom)
  ) {
    const asset = getAsset(parentAssetId, assetId);

    return (
      <View style={containerStyle}>
        <Image
          source={{ uri: requestErc20ImageFile(asset.coinGeckoId) }}
          defaultSource={{ uri: fallbackIcon }}
          style={[iconStyle]}
          width={iconSize.width}
          height={iconSize.height}
        />
      </View>
    );
  }

  if (withSubIconAtBottom && parentAssetId !== assetId) {
    return (
      <View style={containerStyle}>
        <Icon
          width={iconSize.width}
          height={iconSize.height}
          style={iconStyle}
        />
        <View style={subContainerStyle}>
          <Image
            source={{
              uri: requestErc20ImageFile(
                getAsset(parentAssetId, assetId).coinGeckoId,
              ),
            }}
            defaultSource={{ uri: fallbackIcon }}
            style={[
              subIconStyle,
              {
                width: subIconSize ?? defaultSubIconSize,
                height: subIconSize ?? defaultSubIconSize,
              },
            ]}
          />
        </View>
      </View>
    );
  }

  if (withParentIconAtBottom && parentAssetId !== assetId) {
    return (
      <View style={containerStyle}>
        <Image
          source={{
            uri: requestErc20ImageFile(
              getAsset(parentAssetId, assetId).coinGeckoId,
            ),
          }}
          defaultSource={{ uri: fallbackIcon }}
          style={[iconStyle]}
          width={iconSize.width}
          height={iconSize.height}
        />
        <View style={subContainerStyle}>
          <Icon
            width={subIconSize ?? defaultSubIconSize}
            height={subIconSize ?? defaultSubIconSize}
            style={subIconStyle}
          />
        </View>
      </View>
    );
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
