import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import {
  BtcIdMap,
  EvmIdMap,
  SolanaIdMap,
  NearIdMap,
  XrpIdMap,
} from '@cypherock/coins';
import { getAsset } from '@cypherock/coin-support-utils';
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

  const containerStyle = {
    ...styles.container,
    width: size,
    height: size,
    backgroundColor: withBackground ? '#27221D' : 'transparent',
  };

  const iconStyle = {
    ...styles.icon,
  };

  const defaultSubIconSize = 20;
  const defaultSubContainerSize = 21;

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
          style={[iconStyle, { width: size, height: size }]}
        />
      </View>
    );
  }

  if (withSubIconAtBottom && parentAssetId !== assetId) {
    return (
      <View style={containerStyle}>
        <Icon width={size} height={size} style={iconStyle} />
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
          style={[iconStyle, { width: size, height: size }]}
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
      <Icon width={size} height={size} style={iconStyle} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: 8,
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  subContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 50,
    backgroundColor: '#27221D',
  },
  subIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
