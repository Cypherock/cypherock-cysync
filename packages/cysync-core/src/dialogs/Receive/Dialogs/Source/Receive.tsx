import {
  LangDisplay,
  DialogBox,
  DialogBoxBody,
  Typography,
  Container,
  DialogBoxFooter,
  Button,
  Dropdown,
  bitcoinIcon,
  etheriumBlueIcon,
  DropDownListItemProps,
  walletIcon,
  svgGradients,
  Image,
} from '@cypherock/cysync-ui';
import { binanceIcon, solanaIcon } from '@cypherock/cysync-ui/src';
import React, { useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useReceiveDialog } from '../../context';
import SvgArrowReceivedIcon from '@cypherock/cysync-ui/src/assets/icons/generated/ArrowReceivedIcon';

const dropDownData: DropDownListItemProps[] = [
  {
    id: '41',
    leftImage: <Image src={bitcoinIcon} alt="bitcoin icon" />,
    shortForm: '(ETH)',
    text: 'Ethereum 1',
    checkType: 'radio',
    rightText: '0.015 ETH',
  },
  {
    id: '143',
    leftImage: <Image src={solanaIcon} alt="solana icon" />,
    shortForm: '(DAI)',
    text: 'DAI Stable Coin v2',
    checkType: 'radio',
    rightText: '0.234 DAI',
    $parentId: '41',
  },
  {
    id: '144',
    leftImage: <Image src={binanceIcon} alt="binance icon" />,
    shortForm: '(USDC)',
    text: 'USD COIN',
    checkType: 'radio',
    rightText: '0.234 USD',
    $parentId: '41',
  },
  {
    id: '42',
    leftImage: <Image src={solanaIcon} alt="solana icon" />,
    shortForm: '(SOL)',
    text: 'Solana 1',
    checkType: 'radio',
    rightText: '0.234 SOL',
  },
  {
    id: '43',
    leftImage: <Image src={etheriumBlueIcon} alt="etheriumBlue icon" />,
    text: 'Bitcoin 1',
    shortForm: '(BTC)',
    tag: 'Taproot',
    rightText: '0.234 BTC',
    checkType: 'radio',
  },
  {
    id: '44',
    leftImage: <Image src={binanceIcon} alt="binance icon" />,
    shortForm: '(BNB)',
    text: 'Binance Smart Chain 1',
    rightText: '0.234 BNB',
    checkType: 'radio',
  },
  {
    id: '46',
    leftImage: <Image src={binanceIcon} alt="binance icon" />,
    shortForm: '(BNB)',
    text: 'Binance Smart Chain 1',
    rightText: '0.234 BNB',
    checkType: 'radio',
  },
  {
    id: '47',
    leftImage: <Image src={binanceIcon} alt="binance icon" />,
    shortForm: '(BNB)',
    text: 'Binance Smart Chain 1',
    rightText: '0.234 BNB',
    checkType: 'radio',
  },
  {
    id: '48',
    leftImage: <Image src={binanceIcon} alt="binance icon" />,
    shortForm: '(BNB)',
    text: 'Binance Smart Chain 1',
    rightText: '0.234 BNB',
    checkType: 'radio',
  },
];
const dropDownDataWithWallet: DropDownListItemProps[] = [
  {
    id: '51',
    text: 'Official',
    checkType: 'radio',
    leftImage: <Image src={walletIcon} alt="wallet icon" />,
  },
  {
    id: '52',
    text: 'Cypherock Red',
    checkType: 'radio',
    leftImage: <Image src={walletIcon} alt="wallet icon" />,
  },
  {
    id: '53',
    text: 'Personal',
    checkType: 'radio',
    leftImage: <Image src={walletIcon} alt="wallet icon" />,
  },
  {
    id: '54',
    text: 'Business',
    checkType: 'radio',
    leftImage: <Image src={walletIcon} alt="wallet icon" />,
  },
];

interface DropdownState {
  isFirstDropdownSelected: boolean;
  isSecondDropdownSelected: boolean;
  firstDropdownSelection: string;
  secondDropdownSelection: string | undefined;
}

export const Receive: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const receive = lang.strings.receive.receive.info.dialogBox;
  const button = lang.strings.buttons;
  const { onNext } = useReceiveDialog();

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

  const handleSecondDropdownSelectionChange = async (
    selectedItemId: string | undefined,
  ) => {
    await setDropdownState(prev => ({
      ...prev,
      secondDropdownSelection: selectedItemId ?? '',
      isSecondDropdownSelected: !!selectedItemId,
    }));
  };

  return (
    <DialogBox width={500}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <SvgArrowReceivedIcon
          height={48}
          width={56}
          fill={`url(#${svgGradients.gold})`}
        />
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={receive.header} />
          </Typography>
          <Typography
            variant="span"
            $textAlign="center"
            $fontSize={14}
            $fontWeight="normal"
            color="muted"
          >
            <LangDisplay text={receive.subheader} />
          </Typography>
        </Container>
        <Container display="flex" direction="column" gap={20} width="full">
          <Dropdown
            items={dropDownDataWithWallet}
            selectedItem={dropdownState.firstDropdownSelection}
            searchText={receive.searchText}
            placeholderText={receive.placeholderWalletText}
            onChange={handleFirstDropdownSelectionChange}
            leftImage={<Image src={walletIcon} alt="wallet icon" ml={3} />}
          />
          <Dropdown
            items={dropDownData}
            selectedItem={dropdownState.secondDropdownSelection}
            disabled={!dropdownState.isFirstDropdownSelected}
            searchText={receive.searchText}
            placeholderText={receive.placeholderText}
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
