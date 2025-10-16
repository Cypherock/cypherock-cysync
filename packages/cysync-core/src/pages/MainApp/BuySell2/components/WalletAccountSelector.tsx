import { Dropdown, Flex, Typography } from '@cypherock/cysync-ui';
import React, { useCallback } from 'react';

import { useBuySell2 } from '~/context';
import { ANALYTICS_EVENTS, analyticsService } from '~/services';
import { selectLanguage, useAppSelector } from '~/store';
import logger from '~/utils/logger';

export const WalletAccountSelector = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.buySell2.input.accounts;

  const {
    walletDropdownList,
    selectedWallet,
    handleWalletChange,
    accountDropdownList,
    selectedAccount,
    handleAccountChange,
  } = useBuySell2();

  const handleWalletChangeProxy: typeof handleWalletChange = useCallback(
    (...args) => {
      logger.info('Dropdown Change: Wallet Change', {
        source: 'Buy',
        isWalletSelected: Boolean(args[0]),
      });
      analyticsService.trackEvent(ANALYTICS_EVENTS.BUY_CRYPTO_WALLET_SELECTED);
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
      analyticsService.trackEvent(
        ANALYTICS_EVENTS.BUY_CRYPTO_ACCOUNT_SELECTED,
        {
          assetId: selectedAccount?.assetId,
        },
      );
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
