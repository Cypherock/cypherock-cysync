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
  ArrowSentIcon,
} from '@cypherock/cysync-ui';
import React, { useCallback, useState } from 'react';

import { selectAccounts, selectLanguage, useAppSelector } from '~/store';
import logger from '~/utils/logger';

import { useSendDialog } from '../context';

export const SelectionDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const {
    onSelectionDialogNext,
    selectedAccount,
    selectedWallet,
    handleAccountChange,
    handleWalletChange,
    walletDropdownList,
    accountDropdownList,
    defaultWalletId,
    defaultAccountId,
  } = useSendDialog();

  const dialogText = lang.strings.send.source;
  const buttonText = lang.strings.buttons;

  const { accounts: allAccounts } = useAppSelector(selectAccounts);

  const handleWalletChangeProxy: typeof handleWalletChange = useCallback(
    (...args) => {
      logger.info('Dropdown Change: Wallet Change', {
        source: `Send/${SelectionDialog.name}`,
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
        source: `Send/${SelectionDialog.name}`,
        assetId: targetAccount?.assetId,
        derivationPath: targetAccount?.derivationPath,
      });
      return handleAccountChange(id, ...args);
    },
    [allAccounts, handleAccountChange],
  );

  const [isLoading, setIsLoading] = useState(false);
  const handleContinue = useCallback(() => {
    setIsLoading(true);
    onSelectionDialogNext();
  }, [onSelectionDialogNext, setIsLoading]);

  return (
    <DialogBox width={500}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <ArrowSentIcon
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
            noLeftImageInList
            autoFocus={!defaultWalletId}
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
          isLoading={isLoading}
          disabled={!selectedAccount || !selectedWallet || isLoading}
          autoFocus={Boolean(defaultWalletId) && Boolean(defaultAccountId)}
          onClick={e => {
            e.preventDefault();
            handleContinue();
          }}
        >
          <LangDisplay text={buttonText.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
