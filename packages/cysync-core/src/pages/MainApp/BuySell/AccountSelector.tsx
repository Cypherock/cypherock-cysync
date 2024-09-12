import {
  DialogBox,
  DialogBoxHeader,
  Typography,
  DialogBoxBody,
  Container,
  LangDisplay,
  Dropdown,
  DialogBoxFooter,
  Button,
} from '@cypherock/cysync-ui';
import React, { useCallback } from 'react';

import { useBuySell } from '~/context';
import { useAppSelector, selectLanguage } from '~/store';
import logger from '~/utils/logger';

export const BuySellAccountSelector = () => {
  const lang = useAppSelector(selectLanguage);
  const {
    selectedWallet,
    handleWalletChange,
    walletDropdownList,
    accountDropdownList,
    selectedAccount,
    setSelectedAccount,
    accountList,
  } = useBuySell();

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

  const handleAccountChange = useCallback(
    (id?: string) => {
      const targetAccount = !id ? undefined : accountList[id];
      logger.info('Dropdown Change: Account Change', {
        source: 'Buy',
        account: targetAccount
          ? {
              assetId: targetAccount.assetId,
              derivationPath: targetAccount.derivationPath,
            }
          : undefined,
      });
      setSelectedAccount(targetAccount);
    },
    [accountList],
  );

  const onSubmit = () => {
    logger.info('Button Click: Buy', {
      source: 'Buy',
      walletId: selectedWallet?.__id,
      accountId: selectedAccount?.__id,
    });
  };

  return (
    <DialogBox width={500}>
      <DialogBoxHeader direction="row" py={2} px={3}>
        <Typography
          grow={1}
          $alignSelf="stretch"
          color="muted"
          $textAlign="center"
        >
          Buy
        </Typography>
      </DialogBoxHeader>

      <DialogBoxBody p={0} gap={0}>
        <Container
          display="flex"
          direction="column"
          gap={32}
          py={4}
          px={5}
          width="full"
        >
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text="Buy" />
          </Typography>
        </Container>
        <Container
          display="flex"
          direction="column"
          px={5}
          pt={2}
          pb={4}
          gap={24}
          width="full"
        >
          <Dropdown
            items={walletDropdownList}
            selectedItem={selectedWallet?.__id}
            searchText="Search wallet"
            placeholderText="Select wallet"
            onChange={handleWalletChangeProxy}
            noLeftImageInList
          />
          <Dropdown
            items={accountDropdownList}
            selectedItem={selectedAccount?.__id}
            disabled={!selectedWallet}
            searchText="Search account"
            placeholderText="Select account"
            onChange={handleAccountChange}
          />
        </Container>
      </DialogBoxBody>

      <DialogBoxFooter>
        <Button
          variant="primary"
          disabled={!selectedWallet || !selectedAccount}
          onClick={onSubmit}
        >
          <LangDisplay text={lang.strings.buttons.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
