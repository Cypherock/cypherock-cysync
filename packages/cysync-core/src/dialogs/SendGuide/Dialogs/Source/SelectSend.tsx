import {
  LangDisplay,
  DialogBox,
  DialogBoxBody,
  Typography,
  Image,
  Container,
  DialogBoxFooter,
  Button,
  Dropdown,
  binanceIcon,
  goldSendIcon,
  solanaIcon,
  bitcoinIcon,
  etheriumBlueIcon,
  DropDownListItemProps,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';
import { selectLanguage, useAppSelector } from '~/store';
import { useSendGuide } from '../../context';

const dropDownData: DropDownListItemProps[] = [
  {
    id: '41',
    leftImage: bitcoinIcon,
    shortForm: '(BTC)',
    text: 'Bitcoin',
    checkType: 'radio',
  },
  {
    id: '42',
    leftImage: etheriumBlueIcon,
    text: 'Ethereum',
    shortForm: '(ETH)',
    checkType: 'radio',
  },
  {
    id: '43',
    leftImage: solanaIcon,
    shortForm: '(SOL)',
    text: 'Solana',
    checkType: 'radio',
  },
  {
    id: '44',
    leftImage: binanceIcon,
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
  },
  {
    id: '52',
    text: 'Cypherock Red',
    checkType: 'radio',
  },
  {
    id: '53',
    text: 'Personal',
    checkType: 'radio',
  },
  {
    id: '54',
    text: 'Business',
    checkType: 'radio',
  },
];

interface DropdownState {
  isFirstDropdownSelected: boolean;
  isSecondDropdownSelected: boolean;
  firstDropdownSelection: string;
  secondDropdownSelection: string | undefined;
}

export const SelectSend: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const button = lang.strings.buttons;
  const select = lang.strings.send.selectSend.info.dialogBox;
  const { onNext } = useSendGuide();

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
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={goldSendIcon} alt="Send Coin" />
        <Container display="flex" direction="column" gap={4} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={select.title} />
          </Typography>
          <Typography variant="span" color="muted">
            <LangDisplay text={select.subTitle} />
          </Typography>
        </Container>
        <Container display="flex" direction="column" gap={20} width="full">
          <Dropdown
            items={dropDownDataWithWallet}
            selectedItem={dropdownState.firstDropdownSelection}
            searchText={select.searchText}
            placeholderText={select.placeholderWalletText}
            onChange={handleFirstDropdownSelectionChange}
          />
          <Dropdown
            items={dropDownData}
            selectedItem={dropdownState.secondDropdownSelection}
            disabled={!dropdownState.isFirstDropdownSelected}
            searchText={select.searchText}
            placeholderText={select.placeholderText}
            onChange={handleSecondDropdownSelectionChange}
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
