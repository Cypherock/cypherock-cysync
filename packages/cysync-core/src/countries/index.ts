import countries from './country';

interface ICountry {
  name: string;
  code: string;
  flag: string;
}

export const countryList: Record<string, ICountry> = countries.reduce<
  Record<string, ICountry>
>(
  (list, country) => ({
    ...list,
    [country.code]: {
      ...country,
    },
  }),
  {},
);
