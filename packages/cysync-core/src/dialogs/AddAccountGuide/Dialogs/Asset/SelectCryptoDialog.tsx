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
} from '@cypherock/cysync-ui';
import { binanceIcon, solanaIcon } from '@cypherock/cysync-ui/src';
import React, { useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useAddAccountGuide } from '../../context';

export const SelectCryptoDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const crypto = lang.strings.addAccount.addAccount.selectCrypto.info.dialogBox;
  const { onNext } = useAddAccountGuide();

  const dropDownData = [
    {
      id: '41',
      leftImageSrc: bitcoinIcon,
      shortForm: '(BTC)',
      text: 'Bitcoin',
      displayRadioButton: true,
    },
    {
      id: '42',
      leftImageSrc: etheriumBlueIcon,
      text: 'Ethereum',
      shortForm: '(ETH)',
      displayRadioButton: true,
    },
    {
      id: '43',
      leftImageSrc: solanaIcon,
      shortForm: '(SOL)',
      text: 'Solana',
      displayRadioButton: true,
    },
    {
      id: '44',
      leftImageSrc: binanceIcon,
      shortForm: '(BTC)',
      text: 'Binance Smart Chain',
      displayRadioButton: true,
    },
  ];
  const dropDownDataWithWallet = [
    {
      id: '51',
      text: 'Official',
      displayRadioButton: true,
    },
    {
      id: '52',
      text: 'Cypherock Red',
      displayRadioButton: true,
    },
    {
      id: '53',
      text: 'Personal',
      displayRadioButton: true,
    },
    {
      id: '54',
      text: 'Business',
      displayRadioButton: true,
    },
  ];

  const [isFirstDropdownSelected, setIsFirstDropdownSelected] =
    useState<boolean>(false);
  const [isSecondDropdownSelected, setIsSecondDropdownSelected] =
    useState<boolean>(true);
  const [firstDropdownSelection, setFirstDropdownSelection] = useState<
    string | undefined
  >('');
  const [secondDropdownSelection, setSecondDropdownSelection] = useState<
    string | undefined
  >();

  const handleFirstDropdownSelectionChange = (
    selectedItemId: string | undefined,
  ) => {
    // Set string state
    setFirstDropdownSelection(selectedItemId ?? '');
    // Set boolean state
    setIsFirstDropdownSelected(!!selectedItemId);
  };

  const handleSecondDropdownSelectionChange = (
    selectedItemId: string | undefined,
  ) => {
    // Set string state
    setSecondDropdownSelection(selectedItemId ?? '');
    // Set boolean state
    setIsSecondDropdownSelected(!!selectedItemId);
  };

  console.log('First Dropdown Selected:', isFirstDropdownSelected);
  console.log('Second Dropdown Selected:', isSecondDropdownSelected);

  // Adjusted console logs
  console.log('First Dropdown Selected:', firstDropdownSelection);
  console.log('Second Dropdown Selected:', secondDropdownSelection);

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
              Cypherock Red
            </Typography>
          </Container>
        </Container>
        <Container display="flex" direction="column" gap={20} width="full">
          <Dropdown
            items={dropDownDataWithWallet}
            selectedItem={firstDropdownSelection}
            searchText={crypto.searchText}
            placeholderText={crypto.placeholderWalletText}
            onChange={handleFirstDropdownSelectionChange}
            changeColorWhite
          />
          <Dropdown
            items={dropDownData}
            selectedItem={secondDropdownSelection}
            disabled={!isFirstDropdownSelected}
            searchText={crypto.searchText}
            placeholderText={crypto.placeholderText}
            onChange={handleSecondDropdownSelectionChange}
          />
        </Container>
      </DialogBoxBody>

      <DialogBoxFooter>
        <Button
          variant="primary"
          disabled={!secondDropdownSelection}
          onClick={e => {
            e.preventDefault();
            onNext();
          }}
        >
          <LangDisplay text={crypto.buttonName} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
