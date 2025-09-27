import { DropDownItemProps, Typography } from '@cypherock/cysync-ui';
import React, { useMemo, useState } from 'react';

import { countryList } from '~/countries';

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface UseCountryDropdownProps {
  defaultCountryCode?: string;
}

export const useCountryDropdown = ({
  defaultCountryCode,
}: UseCountryDropdownProps = {}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>();

  const countryDropdownList: DropDownItemProps[] = useMemo(
    () =>
      Object.values(countryList).map(country => ({
        id: country.code,
        checkType: 'radio',
        text: country.name,
        leftImage: <Typography $fontSize={16}>{country.flag}</Typography>,
      })),
    [countryList],
  );

  const handleCountryChange = (countryCode?: string) => {
    if (!countryCode) {
      setSelectedCountry(undefined);
      return;
    }

    setSelectedCountry(countryList[countryCode]);
  };

  // Set default selection if provided
  React.useEffect(() => {
    if (defaultCountryCode && !selectedCountry) {
      const country = countryList[defaultCountryCode];
      setSelectedCountry(country);
    }
  }, [defaultCountryCode, selectedCountry, countryList]);

  return {
    selectedCountry,
    setSelectedCountry,
    handleCountryChange,
    countryDropdownList,
  };
};
