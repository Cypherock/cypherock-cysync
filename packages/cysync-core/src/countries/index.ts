import countryList from './country';

export interface ICountry {
  name: string;
  code: string;
  flag: string;
}

export const fiatCurrencyList: Record<string, ICountry> = countryList.reduce<
  Record<string, ICountry>
>(
  (list, currency) => ({
    ...list,
    [currency.code]: {
      ...currency,
    },
  }),
  {},
);
