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
  TokenTypes,
} from '@cypherock/coins';
import lodash from 'lodash';

import { ITradingPairs } from './types';

import { binanceService } from '../../services';
import {
  ISupportedCryptoCurrency,
  ISupportedFiatCurrency,
} from '../commonTypes';

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

const tokenList: Record<string, TokenTypes> = Object.fromEntries(
  lodash
    .concat(
      ...[...Object.values(evmCoinList), ...Object.values(tronCoinList)]
        .filter(
          c =>
            window.cysyncEnv.IS_PRODUCTION === 'false' || !c.isUnderDevelopment,
        )
        .map(coin => Object.values(coin.tokens)),
    )
    .map(token => [token.address.toLowerCase(), token]),
);

export const getTradingPairs = async (): Promise<ITradingPairs> => {
  const [pairs, cryptoCurrencies] = await Promise.all([
    binanceService.getTradingPairs(),
    binanceService.getCryptoNetworks(),
  ]);

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

      const token =
        network.contractAddress &&
        tokenList[network.contractAddress.toLowerCase()];

      if (!token) continue;

      if (network.network !== currency.cryptoCurrency) {
        supportedCryptoCurrencies.push({
          cryptoCurrency: token.name,
          network: network.network,
          coin: token,
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
