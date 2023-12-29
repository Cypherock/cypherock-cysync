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
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useAddTokenDialog } from '../context';

export const AddTokenSelectionDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const {
    onNext,
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
  } = useAddTokenDialog();

  const { addToken } = lang.strings;
  const button = lang.strings.buttons;

  const handleTokenChange = (ids: string[]) => {
    setSelectedTokens(ids.map(id => tokenList[id]));
  };

  const handleAccountChange = (ids: string[]) => {
    setSelectedAccounts(ids.map(id => accountList[id]));
  };

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
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={addToken.select.header} />
          </Typography>
        </Container>
        <Container display="flex" direction="column" gap={20} width="full">
          <Dropdown
            items={walletDropdownList}
            selectedItem={selectedWallet?.__id}
            searchText={addToken.select.searchText}
            placeholderText={addToken.select.walletPlaceholder}
            onChange={handleWalletChange}
            noLeftImageInList
          />
          <Dropdown
            items={tokenDropDownList}
            selectedItems={selectedTokens.map(coin => coin.id)}
            disabled={!selectedWallet}
            searchText={addToken.select.searchText}
            placeholderText={addToken.select.tokenPlaceholder}
            onChange={handleTokenChange}
            isMultiSelect
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
      </DialogBoxBody>

      <DialogBoxFooter>
        <Button
          variant="primary"
          disabled={selectedTokens.length === 0 || !selectedWallet}
          onClick={e => {
            e.preventDefault();
            onNext();
          }}
        >
          <LangDisplay text={button.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
