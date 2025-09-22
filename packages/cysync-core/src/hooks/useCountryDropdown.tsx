import { fiatCurrencyList, IFiatCurrency } from '@cypherock/coins';
import { DropDownItemProps, Typography } from '@cypherock/cysync-ui';
import lodash from 'lodash';
import React, { useMemo, useState } from 'react';

export interface Country {
  countryCode: string;
  countryName: string;
  countryFlag: string;
  currencies: IFiatCurrency[];
}

export interface UseCountryDropdownProps {
  defaultCountryCode?: string;
}

export const useCountryDropdown = ({
  defaultCountryCode,
}: UseCountryDropdownProps = {}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>();

  const availableCountries = useMemo(() => {
    const countriesMap = lodash.groupBy(
      Object.values(fiatCurrencyList),
      'countryCode',
    );

    return Object.entries(countriesMap).map(([countryCode, currencies]) => ({
      countryCode,
      countryName: currencies[0].countryName,
      countryFlag: currencies[0].countryFlag,
      currencies,
    })) as Country[];
  }, []);

  const countryDropdownList: DropDownItemProps[] = useMemo(
    () =>
      availableCountries.map(country => ({
        id: country.countryCode,
        checkType: 'radio',
        text: country.countryName,
        leftImage: (
          <Typography $fontSize={16}>{country.countryFlag}</Typography>
        ),
      })),
    [availableCountries],
  );

  const handleCountryChange = (countryCode?: string) => {
    if (!countryCode) {
      setSelectedCountry(undefined);
      return;
    }

    const country = availableCountries.find(c => c.countryCode === countryCode);
    setSelectedCountry(country);
  };

  // Set default selection if provided
  React.useEffect(() => {
    if (defaultCountryCode && !selectedCountry) {
      const country = availableCountries.find(
        c => c.countryCode === defaultCountryCode,
      );
      setSelectedCountry(country);
    }
  }, [defaultCountryCode, selectedCountry, availableCountries]);

  return {
    selectedCountry,
    setSelectedCountry,
    handleCountryChange,
    countryDropdownList,
    availableCountries,
  };
};
