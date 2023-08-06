import {
  LangDisplay,
  DialogBox,
  DialogBoxFooter,
  Button,
  DialogBoxBody,
  Typography,
  LeanBox,
  Container,
  Divider,
  MessageBox,
  ButtonAttributes,
  useTheme,
  AmountToSend,
  FeesDisplay,
  FeesSection,
  InputSection,
  RecipientAddress,
} from '@cypherock/cysync-ui';
import SvgEthereumIcon from '@cypherock/cysync-ui/src/assets/icons/generated/EthereumIcon';
import SvgGoldQuestionMark from '@cypherock/cysync-ui/src/assets/icons/generated/GoldQuestionMark';
import SvgInformationIcon from '@cypherock/cysync-ui/src/assets/icons/generated/InformationIcon';
import React, { useState } from 'react';

import { addKeyboardEvents, useButtonState } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useSendDialog } from '../../../context';

export const Buttons: ButtonAttributes[] = [
  { id: 1, label: 'Standard' },
  { id: 2, label: 'Advanced' },
];

export const Captions = [
  { id: 1, name: 'Min' },
  { id: 2, name: 'Average' },
  { id: 3, name: 'Max' },
];

export const StandardEthereum: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(20);
  const [activeButtonId, setActiveButtonId] = useState(1);
  const [btnState, handleButtonState] = useButtonState();

  const lang = useAppSelector(selectLanguage);
  const button = lang.strings.buttons;
  const eth = lang.strings.send.ethereum.info.dialogBox;
  const theme = useTheme();

  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleRecipientAddressChange = (value: string) => {
    setRecipientAddress(value);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const handleButtonClick = (id: number) => {
    console.log(id);
    setActiveButtonId(id);
  };

  const handleSliderChange = (newValue: number) => {
    setSliderValue(newValue);
  };

  const { onNext, onPrevious } = useSendDialog();

  const keyboardActions = {
    ArrowRight: () => {
      onNext();
    },
    ArrowLeft: () => {
      onPrevious();
    },
  };

  addKeyboardEvents(keyboardActions);

  return (
    <DialogBox width={517}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Container display="flex" direction="column" gap={16} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={eth.text} />
          </Typography>
          <Typography variant="span" $textAlign="center" color="muted" mb={4}>
            <LangDisplay text={eth.subText} />
          </Typography>
          <LeanBox
            leftImage={
              <SvgInformationIcon
                height={16}
                width={16}
                fill={theme.palette.background.muted}
              />
            }
            text={eth.InfoBox.text}
            altText={eth.InfoBox.altText}
            textVariant="span"
            fontSize={12}
            rightImage={<SvgGoldQuestionMark height={14} width={14} />}
          />
          <Container display="flex" direction="column" gap={8} width="full">
            <RecipientAddress
              text={eth.recipient.text}
              placeholder={eth.recipient.placeholder}
              error={eth.recipient.error}
              value={recipientAddress}
              onChange={handleRecipientAddressChange}
            />
            <AmountToSend
              text={eth.amount.text}
              coin={eth.amount.coin}
              toggle={eth.amount.toggle}
              dollar={eth.amount.dollar}
              error={eth.amount.error}
              isButtonEnabled={handleButtonState}
              placeholder={eth.amount.placeholder}
              value={amount}
              onChange={handleAmountChange}
            />
          </Container>
          <Divider variant="horizontal" />
          <FeesSection
            activeButtonId={activeButtonId}
            handleButtonClick={handleButtonClick}
            single={eth}
            Buttons={Buttons}
          />
          <InputSection
            activeButtonId={activeButtonId}
            single={eth}
            sliderValue={sliderValue}
            handleSliderChange={handleSliderChange}
            Captions={Captions}
            error={eth.fees.error}
            gas
          />

          {/* { activeButtonId === 2 && 
            <ToggleSection 
              single={eth} 
              error={eth.fees.error} />
          } */}

          <FeesDisplay
            fees={eth.fees}
            image={<SvgEthereumIcon width={16} height={16} />}
          />
          <MessageBox type="warning" text={eth.warning} />
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter height={101}>
        <Button variant="secondary">
          <LangDisplay text={button.back} />
        </Button>
        <Button variant="primary" disabled={!btnState}>
          <LangDisplay text={button.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
