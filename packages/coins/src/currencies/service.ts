import currencies from './currency';

import { IFiatCurrency } from './index';

export const getFiatCurrencies = (): IFiatCurrency[] => currencies;

export const getFiatCurrency = (code: string): IFiatCurrency | undefined =>
  currencies.find(c => c.code.toLowerCase() === code.toLowerCase());
