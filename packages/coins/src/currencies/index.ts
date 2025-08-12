import currencyList from './currency';

export interface IFiatCurrency {
  name: string;
  code: string;
  decimals: string;
  countryName: string;
  countryCode: string;
  countryFlag: string;
}

export const fiatCurrencyList: Record<string, IFiatCurrency> =
  currencyList.reduce<Record<string, IFiatCurrency>>(
    (list, currency) => ({
      ...list,
      [currency.code]: {
        ...currency,
      },
    }),
    {},
  );
