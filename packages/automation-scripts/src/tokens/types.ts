import {
  IEvmCoinInfo,
  IIcpCoinInfo,
  ISolanaCoinInfo,
  ITronCoinInfo,
} from '@cypherock/coins';

export type CoingeckoPlatformMapping = Record<string, string>;

export interface CoingeckoCoinListItem {
  id: string;
  symbol: string;
  name: string;
  platforms?: CoingeckoPlatformMapping;
}

export interface CoingeckoCoinDetails {
  id: string;
  symbol: string;
  name: string;
  detail_platforms?: Record<
    string,
    { decimal_place: number; contract_address: string }
  >;
  market_data?: {
    market_cap?: {
      usd?: number;
    };
  };
  description?: {
    en?: string;
  };
  image?: {
    thumb?: string;
    small?: string;
    large?: string;
  };
  last_updated?: string;
}

export type TokenAssetIdGenerator = (params: {
  parentAssetId: string;
  assetId: string;
  version?: string | undefined;
}) => string;

export interface TokenAutomationParams {
  createTokenAssetId: TokenAssetIdGenerator;
  tokenJsonList: TokenListItem[];
  coinList: Record<
    string,
    IEvmCoinInfo | ITronCoinInfo | ISolanaCoinInfo | IIcpCoinInfo
  >;
  coinIdMap: Record<string, string>;
  coingeckoPlatformMapping: CoingeckoPlatformMapping;
  filePrefix: string;
}

export interface TokenListItem {
  id: string;
  symbol: string;
  name: string;
  market_cap?: number;
  version?: string;
  platforms?: Record<
    string,
    { contract_address: string; decimal_place: number } | undefined
  >;
  description?: {
    en?: string;
  };
  image?: {
    thumb?: string;
    small?: string;
    large?: string;
  };
  last_updated_at?: string;
  is_zero_value_coin?: boolean;
  is_custom_coin?: boolean;
}
