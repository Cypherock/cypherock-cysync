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
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

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
  } = useReceiveDialog();

  const dialogText = lang.strings.receive.source;
  const buttonText = lang.strings.buttons;

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
            onChange={handleWalletChange}
            noLeftImageInList
          />
          <Dropdown
            items={accountDropdownList}
            selectedItem={selectedAccount?.__id}
            disabled={!selectedWallet}
            searchText={dialogText.searchText}
            placeholderText={dialogText.accountPlaceholder}
            onChange={handleAccountChange}
          />
        </Container>
      </DialogBoxBody>

      <DialogBoxFooter>
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
