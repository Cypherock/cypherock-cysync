import { Dropdown, Flex, Typography } from '@cypherock/cysync-ui';
import React, { useCallback } from 'react';

import { useBuySell2 } from '~/context';
import logger from '~/utils/logger';

export const WalletAccountSelector = () => {
  const {
    walletDropdownList,
    selectedWallet,
    handleWalletChange,
    accountDropdownList,
    selectedAccount,
    handleAccountChange,
  } = useBuySell2();

  const strings = {
    title: 'To',
    selectWallet: {
      searchText: 'Search Wallet',
      placeholder: 'Select Wallet',
    },
    selectAccount: {
      searchText: 'Search Account',
      placeholder: 'Select an Account',
    },
  };

  const handleWalletChangeProxy: typeof handleWalletChange = useCallback(
    (...args) => {
      logger.info('Dropdown Change: Wallet Change', {
        source: 'Buy',
        isWalletSelected: Boolean(args[0]),
      });
      handleWalletChange(...args);
    },
    [handleWalletChange],
  );

  const handleAccountChangeProxy: typeof handleAccountChange = useCallback(
    (...args) => {
      logger.info('Dropdown Change: Account Change', {
        source: 'Buy',
        isAccountSelected: Boolean(args[0]),
      });
      handleAccountChange(...args);
    },
    [handleAccountChange],
  );

  return (
    <Flex direction="column" gap={8}>
      <Typography $fontSize={12} color="muted">
        {strings.title}
      </Typography>

      <Dropdown
        items={walletDropdownList}
        selectedItem={selectedWallet?.__id}
        onChange={handleWalletChangeProxy}
        searchText={strings.selectWallet.searchText}
        placeholderText={strings.selectWallet.placeholder}
      />

      <Dropdown
        items={accountDropdownList}
        selectedItem={selectedAccount?.__id}
        onChange={handleAccountChangeProxy}
        searchText={strings.selectAccount.searchText}
        placeholderText={strings.selectAccount.placeholder}
        disabled={!selectedWallet}
      />
    </Flex>
  );
};
