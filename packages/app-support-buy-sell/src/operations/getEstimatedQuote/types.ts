import { BinanceGetEstimatedQuoteResponse } from '../../services';
import {
  ISupportedFiatCurrency,
  ISupportedCryptoCurrency,
} from '../commonTypes';

export interface IGetEstimatedQuoteParams {
  fiatCurrency: ISupportedFiatCurrency;
  cryptoCurrency: ISupportedCryptoCurrency;
  fiatAmount?: string;
  cryptoAmount?: string;
}

export type IEstimatedQuote = BinanceGetEstimatedQuoteResponse['data'];
