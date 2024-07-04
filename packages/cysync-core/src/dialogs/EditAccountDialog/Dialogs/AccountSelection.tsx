import {
  Button,
  CloseButton,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
  Dropdown,
  EditAccountIcon,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useCallback } from 'react';

import { selectAccounts, selectLanguage, useAppSelector } from '~/store';
import logger from '~/utils/logger';

import { useEditAccountDialog } from '../context';

export const AccountSelection: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const {
    onNext,
    onClose,
    selectedAccount,
    selectedWallet,
    handleAccountChange,
    handleWalletChange,
    walletDropdownList,
    accountDropdownList,
  } = useEditAccountDialog();

  const { accountSelection, header: headerText } =
    lang.strings.dialogs.editAccount;
  const buttonText = lang.strings.buttons;
  const { accounts: allAccounts } = useAppSelector(selectAccounts);

  const handleWalletChangeProxy: typeof handleWalletChange = useCallback(
    (...args) => {
      logger.info('Dropdown Change: Wallet Change', {
        source: `EditAccount/${AccountSelection.name}`,
        isWalletSelected: Boolean(args[0]),
      });
      return handleWalletChange(...args);
    },
    [handleWalletChange],
  );

  const handleAccountChangeProxy: typeof handleAccountChange = useCallback(
    (id: string | undefined, ...args) => {
      const targetAccount = allAccounts.find(a => a.__id === id);
      logger.info('Dropdown Change: Account Change', {
        source: `EditAccount/${AccountSelection.name}`,
        assetId: targetAccount?.assetId,
        derivationPath: targetAccount?.derivationPath,
      });
      return handleAccountChange(id, ...args);
    },
    [allAccounts, handleAccountChange],
  );

  return (
    <DialogBox width={500} onClose={onClose}>
      <DialogBoxHeader direction="row" py={2} px={3}>
        <Typography
          pl={3}
          grow={1}
          $alignSelf="stretch"
          color="muted"
          $textAlign="center"
        >
          <LangDisplay text={headerText} />
        </Typography>
        <CloseButton width={24} onClick={onClose} />
      </DialogBoxHeader>
      <DialogBoxBody p={0} gap={0}>
        <Container
          display="flex"
          direction="column"
          gap={{ def: 16, lg: 32 }}
          width="full"
          pt={4}
          pb={{ def: 2, lg: 4 }}
          px={{ def: 3, lg: 5 }}
        >
          <EditAccountIcon height={102} width={100} />
          <Container display="flex" direction="column" gap={4} width="full">
            <Typography variant="h5" $textAlign="center" $fontSize={20}>
              <LangDisplay text={accountSelection.title} />
            </Typography>
            <Typography
              $textAlign="center"
              $fontSize={16}
              $fontWeight="normal"
              color="muted"
            >
              <LangDisplay text={accountSelection.subtitle} />
            </Typography>
          </Container>
        </Container>
        <Container
          display="flex"
          direction="column"
          width="full"
          pt={2}
          pb={{ def: 2, lg: 4 }}
          px={{ def: 3, lg: 5 }}
          gap={24}
        >
          <Dropdown
            items={walletDropdownList}
            selectedItem={selectedWallet?.__id}
            searchText={accountSelection.searchText}
            placeholderText={accountSelection.walletPlaceholder}
            onChange={handleWalletChangeProxy}
            noLeftImageInList
          />
          <Dropdown
            items={accountDropdownList}
            selectedItem={selectedAccount?.__id}
            disabled={!selectedWallet}
            searchText={accountSelection.searchText}
            placeholderText={accountSelection.accountPlaceholder}
            onChange={handleAccountChangeProxy}
          />
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter py={4} px={5}>
        <Button
          variant="primary"
          disabled={!selectedAccount || !selectedWallet}
          onClick={e => {
            e.preventDefault();
            onNext();
          }}
        >
          <LangDisplay text={buttonText.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
