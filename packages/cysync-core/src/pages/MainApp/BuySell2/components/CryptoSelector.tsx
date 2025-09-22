import { Dropdown, Typography, Flex } from '@cypherock/cysync-ui';
import React from 'react';

import { useBuySell2 } from '~/context/buySell2';

export const CryptoSelector = () => {
  const strings = {
    title: 'Select crypto currency',
    selectCrypto: {
      searchText: 'Search Crypto Currency',
      placeholder: 'Select Crypto Currency',
    },
  };

  const { cryptoDropdownList, selectedCrypto, handleCryptoChange } =
    useBuySell2();

  return (
    <Flex direction="column" gap={8}>
      <Typography $fontSize={12} color="muted">
        {strings.title}
      </Typography>

      <Dropdown
        items={cryptoDropdownList}
        selectedItem={selectedCrypto?.__id}
        onChange={handleCryptoChange}
        searchText={strings.selectCrypto.searchText}
        placeholderText={strings.selectCrypto.placeholder}
      />
    </Flex>
  );
};
