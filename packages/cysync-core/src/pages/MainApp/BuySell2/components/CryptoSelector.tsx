import { Dropdown, Typography, Flex } from '@cypherock/cysync-ui';
import React from 'react';
import { useSelector } from 'react-redux';

import { useBuySell2 } from '~/context/buySell2';
import { ANALYTICS_EVENTS, analyticsService } from '~/services';
import { selectLanguage } from '~/store';
import logger from '~/utils/logger';

export const CryptoSelector = () => {
  const lang = useSelector(selectLanguage);

  const strings = lang.strings.buySell2.input.crypto;

  const { cryptoDropdownList, selectedCrypto, handleCryptoChange } =
    useBuySell2();

  const handleCryptoChangeProxy = (id?: string) => {
    logger.info('Dropdown Change: Crypto Currency Change', {
      source: 'Buy',
      currency: id,
    });
    analyticsService.trackEvent(
      ANALYTICS_EVENTS.BUY_CRYPTO_CRYPTO_CURRENCY_SELECTED,
      {
        cryptoCurrency: id,
      },
    );
    handleCryptoChange(id);
  };

  return (
    <Flex direction="column" gap={8}>
      <Typography $fontSize={12} color="muted">
        {strings.title}
      </Typography>

      <Dropdown
        items={cryptoDropdownList}
        selectedItem={selectedCrypto?.__id}
        onChange={handleCryptoChangeProxy}
        searchText={strings.selectCrypto.searchText}
        placeholderText={strings.selectCrypto.placeholder}
      />
    </Flex>
  );
};
