import {
  Button,
  CloseButton,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
  Dropdown,
  LangDisplay,
  Typography,
  MessageBox,
  addAccountIcon,
  Image,
} from '@cypherock/cysync-ui';
import React, { useCallback } from 'react';

import { selectLanguage, useAppSelector } from '~/store';
import logger from '~/utils/logger';

import { useAddTokenDialog } from '../context';

export const AddTokenSelectionDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const {
    handleCreateToken,
    onClose,
    tokenList,
    accountList,
    selectedTokens,
    selectedWallet,
    setSelectedTokens,
    handleWalletChange,
    walletDropdownList,
    tokenDropDownList,
    accountDropdownList,
    selectedAccounts,
    setSelectedAccounts,
    selectedChainNameWithNoAccount,
    defaultWalletId,
  } = useAddTokenDialog();

  const { addToken } = lang.strings;
  const button = lang.strings.buttons;

  const handleWalletChangeProxy: typeof handleWalletChange = useCallback(
    (...args) => {
      logger.info('Dropdown Change: Wallet Change', {
        source: AddTokenSelectionDialog.name,
        isWalletSelected: Boolean(args[0]),
      });
      handleWalletChange(...args);
    },
    [handleWalletChange],
  );

  const handleTokenChange = useCallback(
    (ids: string[]) => {
      const targetCoins = ids.map(id => tokenList[id]);
      logger.info('Dropdown Change: Token Change', {
        source: AddTokenSelectionDialog.name,
        tokens: targetCoins.map(coin => ({
          name: coin.name,
          parentId: coin.parentId,
        })),
      });
      setSelectedTokens(targetCoins);
    },
    [tokenList],
  );

  const handleAccountChange = useCallback(
    (ids: string[]) => {
      const targetAccounts = ids.map(id => accountList[id]);
      logger.info('Dropdown Change: Account Change', {
        source: AddTokenSelectionDialog.name,
        accounts: targetAccounts.map(a => ({
          assetId: a.assetId,
          derivationPath: a.derivationPath,
        })),
      });
      setSelectedAccounts(targetAccounts);
    },
    [accountList],
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
          <LangDisplay text={addToken.header} />
        </Typography>
        <CloseButton width={24} onClick={onClose} />
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
          <Image src={addAccountIcon} alt="Select Token" />
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={addToken.select.header} />
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
            searchText={addToken.select.searchText}
            placeholderText={addToken.select.walletPlaceholder}
            onChange={handleWalletChangeProxy}
            noLeftImageInList
            autoFocus={!defaultWalletId}
          />
          <Dropdown
            items={tokenDropDownList}
            selectedItems={selectedTokens.map(coin => coin.id)}
            disabled={!selectedWallet}
            searchText={addToken.select.searchText}
            placeholderText={addToken.select.tokenPlaceholder}
            onChange={handleTokenChange}
            isMultiSelect
            autoFocus={Boolean(defaultWalletId)}
          />
          <Dropdown
            items={accountDropdownList}
            selectedItems={selectedAccounts.map(a => a.__id)}
            disabled={!selectedWallet || selectedTokens.length === 0}
            searchText={addToken.select.searchText}
            placeholderText={addToken.select.accountPlaceholder}
            onChange={handleAccountChange}
            isMultiSelect
          />
        </Container>
        {selectedChainNameWithNoAccount && (
          <Container
            display="flex"
            direction="column"
            px={5}
            pt={2}
            pb={4}
            width="full"
          >
            <MessageBox
              type="warning"
              text={addToken.select.message}
              variables={{ chainName: selectedChainNameWithNoAccount }}
            />
          </Container>
        )}
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button
          variant="primary"
          disabled={
            selectedTokens.length === 0 ||
            selectedAccounts.length === 0 ||
            !selectedWallet
          }
          onClick={handleCreateToken}
        >
          <LangDisplay text={button.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
