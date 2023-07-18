import React, { useReducer } from 'react';
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
import { selectLanguage, useAppSelector } from '~/store';
import { useAddAccountGuide } from '../../context';

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

interface State {
  isFirstDropdownSelected: boolean;
  isSecondDropdownSelected: boolean;
  firstDropdownSelection: string;
  secondDropdownSelection: string | undefined;
}

type Action =
  | { type: 'SET_FIRST_DROPDOWN'; payload: string | undefined }
  | { type: 'SET_SECOND_DROPDOWN'; payload: string | undefined };

const initialState: State = {
  isFirstDropdownSelected: false,
  isSecondDropdownSelected: true,
  firstDropdownSelection: '',
  secondDropdownSelection: undefined,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_FIRST_DROPDOWN':
      return {
        ...state,
        firstDropdownSelection: action.payload ?? '',
        isFirstDropdownSelected: !!action.payload,
      };
    case 'SET_SECOND_DROPDOWN':
      return {
        ...state,
        secondDropdownSelection: action.payload ?? '',
        isSecondDropdownSelected: !!action.payload,
      };
    default:
      return state;
  }
};

export const SelectCryptoDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const crypto = lang.strings.addAccount.addAccount.selectCrypto.info.dialogBox;
  const { onNext } = useAddAccountGuide();

  const [dropdownState, dispatch] = useReducer(reducer, initialState);

  const handleFirstDropdownSelectionChange = (
    selectedItemId: string | undefined,
  ) => {
    dispatch({ type: 'SET_FIRST_DROPDOWN', payload: selectedItemId });
  };

  const handleSecondDropdownSelectionChange = (
    selectedItemId: string | undefined,
  ) => {
    dispatch({ type: 'SET_SECOND_DROPDOWN', payload: selectedItemId });
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
              Cypherock Red
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
            changeColorWhite
          />
          <Dropdown
            items={dropDownData}
            selectedItem={dropdownState.secondDropdownSelection}
            disabled={!dropdownState.isFirstDropdownSelected}
            searchText={crypto.searchText}
            placeholderText={crypto.placeholderText}
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
          <LangDisplay text={crypto.buttonName} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
