import {
  btcCoinList,
  BtcIdMap,
  evmCoinList,
  EvmIdMap,
  ICoinInfo,
  solanaCoinList,
  SolanaIdMap,
  tronCoinList,
  TronIdMap,
  fiatCurrencyList,
} from '@cypherock/coins';

import {
  ITradingPairs,
  ISupportedCryptoCurrency,
  ISupportedFiatCurrency,
} from './types';

import { binanceService } from '../../services';

export * from './types';

const networkMapping: Record<string, ICoinInfo | undefined> = {
  ETH: evmCoinList[EvmIdMap.ethereum],
  BSC: evmCoinList[EvmIdMap.binance],
  ARBITRUM: evmCoinList[EvmIdMap.arbitrum],
  AVAXC: evmCoinList[EvmIdMap.avalanche],
  OPTIMISM: evmCoinList[EvmIdMap.optimism],
  FTM: evmCoinList[EvmIdMap.fantom],
  MATIC: evmCoinList[EvmIdMap.polygon],

  BTC: btcCoinList[BtcIdMap.bitcoin],
  DOGE: btcCoinList[BtcIdMap.dogecoin],
  DASH: btcCoinList[BtcIdMap.dash],
  LTC: btcCoinList[BtcIdMap.litecoin],

  SOL: solanaCoinList[SolanaIdMap.solana],
  TRX: tronCoinList[TronIdMap.tron],
};

export const getTradingPairs = async (): Promise<ITradingPairs> => {
  const pairs = await binanceService.getTradingPairs();
  const cryptoCurrencies = await binanceService.getCryptoNetworks();
  const { fiatCurrencies } = pairs;

  const supportedCryptoCurrencies: ISupportedCryptoCurrency[] = [];

  for (const currency of cryptoCurrencies) {
    if (!currency.cryptoCurrency) continue;

    for (const network of currency.networks) {
      const chain = networkMapping[network.network];

      if (!chain) continue;

      if (network.network === currency.cryptoCurrency) {
        supportedCryptoCurrencies.push({
          cryptoCurrency: currency.cryptoCurrency,
          network: network.network,
          coin: chain,
          withdrawFee: network.withdrawFee
            ? network.withdrawFee.toString()
            : undefined,
          withdrawMinAmount: network.withdrawMinAmount
            ? network.withdrawMinAmount.toString()
            : undefined,
          withdrawMaxAmount: network.withdrawMaxAmount
            ? network.withdrawMaxAmount.toString()
            : undefined,
          contractAddress: network.contractAddress ?? undefined,
        });
      }

      // TODO: Add mappings for tokens
    }
  }

  const supportedFiatCurrencies: ISupportedFiatCurrency[] = [];

  for (const currency of fiatCurrencies) {
    const currencyDetails = fiatCurrencyList[currency.toUpperCase()];
    if (!currencyDetails) continue;

    supportedFiatCurrencies.push({
      currency: currencyDetails,
      code: currency,
    });
  }

  return {
    fiatCurrencies: supportedFiatCurrencies,
    cryptoCurrencies: supportedCryptoCurrencies,
  };
};
