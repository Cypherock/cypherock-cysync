import { Dropdown, Typography, Flex } from '@cypherock/cysync-ui';
import React, { useCallback } from 'react';

import { useBuySell2 } from '~/context/buySell2';
import logger from '~/utils/logger';

export const RegionCurrencySelector = () => {
  const strings = {
    title: 'Select region and currency',
    selectCountry: {
      searchText: 'Search Country',
      placeholder: 'Select a Country',
    },
    selectFiat: {
      searchText: 'Search Fiat Currency',
      placeholder: 'Select Fiat Currency',
    },
  };

  const {
    selectedCountry,
    handleCountryChange,
    countryDropdownList,
    selectedFiatCurrency,
    handleFiatCurrencyChange,
    fiatDropdownList,
  } = useBuySell2();

  const handleCountryChangeProxy = useCallback(
    (countryCode?: string) => {
      logger.info('Dropdown Change: Country Change', { countryCode });
      handleCountryChange(countryCode);
    },
    [handleCountryChange],
  );

  const handleCurrencyChangeProxy = useCallback(
    (currencyCode?: string) => {
      logger.info('Dropdown Change: Currency Change', { currencyCode });
      handleFiatCurrencyChange(currencyCode);
    },
    [handleFiatCurrencyChange],
  );

  return (
    <Flex direction="column" gap={8}>
      <Typography $fontSize={12} color="muted">
        {strings.title}
      </Typography>

      <Flex gap={8}>
        <Dropdown
          items={countryDropdownList}
          selectedItem={selectedCountry?.countryCode}
          searchText={strings.selectCountry.searchText}
          placeholderText={strings.selectCountry.placeholder}
          onChange={handleCountryChangeProxy}
        />

        <Dropdown
          items={fiatDropdownList}
          selectedItem={selectedFiatCurrency?.code}
          searchText={strings.selectFiat.searchText}
          placeholderText={strings.selectFiat.placeholder}
          onChange={handleCurrencyChangeProxy}
          disabled={!selectedCountry}
        />
      </Flex>
    </Flex>
  );
};
