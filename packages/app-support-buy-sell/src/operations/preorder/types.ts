import { BinancePreorderResponse } from '../../services';
import {
  ISupportedFiatCurrency,
  ISupportedCryptoCurrency,
} from '../commonTypes';

export interface IPreorderParams {
  fiatCurrency: ISupportedFiatCurrency;
  cryptoCurrency: ISupportedCryptoCurrency;
  fiatAmount: string;
  payMethodCode: string;
  payMethodSubCode: string;
  address: string;
}

export type IPreorderResult = BinancePreorderResponse['data'];
