import { BinanceGetPaymentMethodListResponse } from '../../services';
import {
  ISupportedFiatCurrency,
  ISupportedCryptoCurrency,
} from '../commonTypes';

export interface IGetPaymentMethodsParams {
  fiatCurrency: ISupportedFiatCurrency;
  cryptoCurrency: ISupportedCryptoCurrency;
  fiatAmount?: string;
  cryptoAmount?: string;
  language?: string;
}

export type IPaymentMethod =
  BinanceGetPaymentMethodListResponse['data']['paymentMethods'][0];
