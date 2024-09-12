import { ICoinInfo, IFiatCurrency } from '@cypherock/coins';

export interface ISupportedCryptoCurrency {
  coin: ICoinInfo;
  cryptoCurrency: string;
  network: string;
  withdrawFee?: string;
  withdrawMinAmount?: string;
  withdrawMaxAmount?: string;
  contractAddress?: string;
}

export interface ISupportedFiatCurrency {
  currency: IFiatCurrency;
  code: string;
}

export interface ITradingPairs {
  fiatCurrencies: ISupportedFiatCurrency[];
  cryptoCurrencies: ISupportedCryptoCurrency[];
}
