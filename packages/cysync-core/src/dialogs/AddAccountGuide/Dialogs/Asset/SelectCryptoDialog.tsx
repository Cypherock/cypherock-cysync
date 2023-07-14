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
  bnbChainIcon,
  bitcoinIcon,
  etheriumBlueIcon,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';
import { useAppSelector } from '~/store';
import { useAddAccountGuide } from '../../context';

export const SelectCryptoDialog: React.FC = () => {
  const lang = useAppSelector(state => state.addAccount.strings);
  const crypto = lang.addAccount.selectCrypto.info.dialogBox;
  const { onNext } = useAddAccountGuide();

  const [firstDropdownSelection, setFirstDropdownSelection] = useState<
    string | null
  >(null);
  const [secondDropdownSelection, setSecondDropdownSelection] = useState<
    string | null
  >(null);

  const dropDownData = [
    {
      id: '41', // Add a unique identifier to each data object
      leftImageSrc: bnbChainIcon,
      text: 'BNB Chain 1',
      displayRadioButton: true,
    },
    {
      id: '42',
      leftImageSrc: bitcoinIcon,
      text: 'Bitcoin 1',
      tag: 'TAPROOT',
      displayRadioButton: true,
    },
    {
      id: '43',
      leftImageSrc: etheriumBlueIcon,
      text: 'Etherium 3',
      displayRadioButton: true,
    },
  ];
  const dropDownDataWithWallet = [
    {
      id: '51', // Add a unique identifier to each data object
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

  const handleFirstDropdownSelectionChange = (
    selectedItemId: string | null,
  ) => {
    setFirstDropdownSelection(selectedItemId);
  };

  const handleSecondDropdownSelectionChange = (
    selectedItemId: string | null,
  ) => {
    // Handle the selection change of the second dropdown here
    setSecondDropdownSelection(selectedItemId);
  };

  return (
    <DialogBox width={500} height={500}>
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
            shouldChangeColor
            searchText={crypto.searchText}
            placeholderText={crypto.placeholderWalletText}
            onSelectionChange={handleFirstDropdownSelectionChange}
          />
          <Dropdown
            items={dropDownData}
            disabled={!firstDropdownSelection}
            searchText={crypto.searchText}
            placeholderText={crypto.placeholderText}
            onSelectionChange={handleSecondDropdownSelectionChange}
          />
        </Container>
      </DialogBoxBody>

      <DialogBoxFooter>
        <Button
          variant="primary"
          disabled={!secondDropdownSelection}
          onClick={e => {
            e.preventDefault();
            onNext?.();
          }}
        >
          <LangDisplay text={crypto.buttonName} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
