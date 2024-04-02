import {
  LangDisplay,
  DialogBox,
  DialogBoxBody,
  Typography,
  Container,
  DialogBoxFooter,
  Button,
  Dropdown,
  svgGradients,
  ArrowReceivedIcon,
} from '@cypherock/cysync-ui';
import React, { useCallback } from 'react';

import { selectAccounts, selectLanguage, useAppSelector } from '~/store';
import logger from '~/utils/logger';

import { useReceiveDialog } from '../context';

export const SelectionDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const {
    onNext,
    selectedAccount,
    selectedWallet,
    handleAccountChange,
    handleWalletChange,
    walletDropdownList,
    accountDropdownList,
    defaultWalletId,
    defaultAccountId,
  } = useReceiveDialog();

  const dialogText = lang.strings.receive.source;
  const buttonText = lang.strings.buttons;
  const { accounts: allAccounts } = useAppSelector(selectAccounts);

  const handleWalletChangeProxy: typeof handleWalletChange = useCallback(
    (...args) => {
      logger.info('Dropdown Change: Wallet Change', {
        source: `Receive/${SelectionDialog.name}`,
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
        source: `Receive/${SelectionDialog.name}`,
        assetId: targetAccount?.assetId,
        derivationPath: targetAccount?.derivationPath,
      });
      return handleAccountChange(id, ...args);
    },
    [allAccounts, handleAccountChange],
  );

  return (
    <DialogBox width={500}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <ArrowReceivedIcon
          height={48}
          width={56}
          fill={`url(#${svgGradients.gold})`}
        />
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={dialogText.title} />
          </Typography>
          <Typography
            variant="span"
            $textAlign="center"
            $fontSize={14}
            $fontWeight="normal"
            color="muted"
          >
            <LangDisplay text={dialogText.subtitle} />
          </Typography>
        </Container>
        <Container display="flex" direction="column" gap={20} width="full">
          <Dropdown
            items={walletDropdownList}
            selectedItem={selectedWallet?.__id}
            searchText={dialogText.searchText}
            placeholderText={dialogText.walletPlaceholder}
            onChange={handleWalletChangeProxy}
            autoFocus={!defaultWalletId}
            noLeftImageInList
          />
          <Dropdown
            items={accountDropdownList}
            selectedItem={selectedAccount?.__id}
            disabled={!selectedWallet}
            searchText={dialogText.searchText}
            placeholderText={dialogText.accountPlaceholder}
            onChange={handleAccountChangeProxy}
            autoFocus={Boolean(defaultWalletId) && !defaultAccountId}
          />
        </Container>
      </DialogBoxBody>

      <DialogBoxFooter>
        <Button
          variant="primary"
          disabled={!selectedAccount || !selectedWallet}
          autoFocus={Boolean(defaultWalletId) && Boolean(defaultAccountId)}
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
