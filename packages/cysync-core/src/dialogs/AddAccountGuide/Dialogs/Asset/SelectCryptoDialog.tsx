import {
  LangDisplay,
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  Typography,
  Image,
  Container,
  DialogBoxFooter,
  Button,
  Dropdown,
  addIcon,
  bitcoinIcon,
  etheriumBlueIcon,
  DropDownListItemProps,
  walletIcon,
  solanaIcon,
  binanceIcon,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useAddAccountDialog } from '../../context';

const dropDownData: DropDownListItemProps[] = [
  {
    id: '41',
    leftImageSrc: bitcoinIcon,
    shortForm: '(BTC)',
    text: 'Bitcoin',
    checkType: 'radio',
  },
  {
    id: '42',
    leftImageSrc: etheriumBlueIcon,
    text: 'Ethereum',
    shortForm: '(ETH)',
    checkType: 'radio',
  },
  {
    id: '43',
    leftImageSrc: solanaIcon,
    shortForm: '(SOL)',
    text: 'Solana',
    checkType: 'radio',
  },
  {
    id: '44',
    leftImageSrc: binanceIcon,
    shortForm: '(BTC)',
    text: 'Binance Smart Chain',
    checkType: 'radio',
  },
];
const dropDownDataWithWallet: DropDownListItemProps[] = [
  {
    id: '51',
    text: 'Official',
    checkType: 'radio',
    leftImageSrc: walletIcon,
  },
  {
    id: '52',
    text: 'Cypherock Red',
    checkType: 'radio',
    leftImageSrc: walletIcon,
  },
  {
    id: '53',
    text: 'Personal',
    checkType: 'radio',
    leftImageSrc: walletIcon,
  },
  {
    id: '54',
    text: 'Business',
    checkType: 'radio',
    leftImageSrc: walletIcon,
  },
];

interface DropdownState {
  isFirstDropdownSelected: boolean;
  isSecondDropdownSelected: boolean;
  firstDropdownSelection: string;
  secondDropdownSelection: string | undefined;
}

export const SelectCryptoDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const crypto = lang.strings.addAccount.addAccount.selectCrypto.info.dialogBox;
  const button = lang.strings.buttons;
  const { onNext } = useAddAccountDialog();

  const [dropdownState, setDropdownState] = useState<DropdownState>({
    isFirstDropdownSelected: false,
    isSecondDropdownSelected: false,
    firstDropdownSelection: '',
    secondDropdownSelection: '',
  });

  const handleFirstDropdownSelectionChange = (
    selectedItemId: string | undefined,
  ) => {
    setDropdownState(prev => ({
      ...prev,
      firstDropdownSelection: selectedItemId ?? '',
      isFirstDropdownSelected: !!selectedItemId,
    }));
  };

  const handleSecondDropdownSelectionChange = (
    selectedItemId: string | undefined,
  ) => {
    setDropdownState(prev => ({
      ...prev,
      secondDropdownSelection: selectedItemId ?? '',
      isSecondDropdownSelected: !!selectedItemId,
    }));
  };

  return (
    <DialogBox width={500}>
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          <LangDisplay text={crypto.title} />
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={addIcon} alt="Verify Coin" />
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={crypto.header} />
          </Typography>
          <Container display="flex" gap={5}>
            <Typography variant="span" color="muted">
              <LangDisplay text={crypto.subTitle} />
            </Typography>
            <Typography variant="span" color="white">
              {crypto.text}
            </Typography>
          </Container>
        </Container>
        <Container display="flex" direction="column" gap={20} width="full">
          <Dropdown
            items={dropDownDataWithWallet}
            selectedItem={dropdownState.firstDropdownSelection}
            searchText={crypto.searchText}
            placeholderText={crypto.placeholderWalletText}
            onChange={handleFirstDropdownSelectionChange}
          />
          <Dropdown
            items={dropDownData}
            selectedItem={dropdownState.secondDropdownSelection}
            disabled={!dropdownState.isFirstDropdownSelected}
            searchText={crypto.searchText}
            placeholderText={crypto.placeholderText}
            onChange={handleSecondDropdownSelectionChange}
            shouldShowIcon
          />
        </Container>
      </DialogBoxBody>

      <DialogBoxFooter>
        <Button
          variant="primary"
          disabled={!dropdownState.secondDropdownSelection}
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
