import { Dropdown, Typography, Flex } from '@cypherock/cysync-ui';
import React, { useCallback } from 'react';

import { useBuySell2 } from '~/context/buySell2';
import { ANALYTICS_EVENTS, analyticsService } from '~/services';
import { selectLanguage, useAppSelector } from '~/store';
import logger from '~/utils/logger';

export const RegionCurrencySelector = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.buySell2.input.region;

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
      analyticsService.trackEvent(ANALYTICS_EVENTS.BUY_CRYPTO_COUNTRY_SELECTED);
      handleCountryChange(countryCode);
    },
    [handleCountryChange],
  );

  const handleCurrencyChangeProxy = useCallback(
    (currencyCode?: string) => {
      logger.info('Dropdown Change: Currency Change', { currencyCode });
      analyticsService.trackEvent(
        ANALYTICS_EVENTS.BUY_CRYPTO_FIAT_CURRENCY_SELECTED,
        {
          fiatCurrency: currencyCode,
        },
      );
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
          selectedItem={selectedCountry?.code}
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
