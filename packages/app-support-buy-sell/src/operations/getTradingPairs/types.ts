import {
  ISupportedFiatCurrency,
  ISupportedCryptoCurrency,
} from '../commonTypes';

export interface ITradingPairs {
  fiatCurrencies: ISupportedFiatCurrency[];
  cryptoCurrencies: ISupportedCryptoCurrency[];
}
