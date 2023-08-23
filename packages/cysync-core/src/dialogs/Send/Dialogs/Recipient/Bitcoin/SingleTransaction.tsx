import {
  LeanBox,
  Container,
  Divider,
  MessageBox,
  useTheme,
  BitcoinIcon,
  RecipientAddress,
  ToggleSection,
  useRecipientAddress,
  GoldQuestionMark,
  InformationIcon,
  useToggle,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useSendDialog } from '../../../context';
import { AmountToSend } from '../AmountToSend';
import { Buttons, Captions } from '../Ethereum';
import { FeesDisplay } from '../FeesDisplay';
import { FeesSection } from '../FeesSection';
import { RecipientInput } from '../RecipientInput';

interface SingleTransactionProps {
  handleButtonState: (shouldActivate: boolean) => void;
}

export const SingleTransaction: React.FC<SingleTransactionProps> = ({
  handleButtonState,
}) => {
  const [sliderValue, setSliderValue] = useState(20);
  const [type, setType] = useState<'slider' | 'input'>('slider');
  const lang = useAppSelector(selectLanguage);
  const { single } = lang.strings.send.bitcoin.info.dialogBox;
  const theme = useTheme();
  const {
    isChecked: isCheckedReplace,
    handleToggleChange: handleToggleChangeReplace,
  } = useToggle();
  const {
    isChecked: isCheckedUnconfirmed,
    handleToggleChange: handleToggleChangeUnconfirmed,
  } = useToggle();

  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleRecipientAddressChange = (value: string) => {
    setRecipientAddress(value);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

  const handleButtonClick = (newType: 'slider' | 'input') => {
    setType(newType);
  };

  const handleSliderChange = (newValue: number) => {
    setSliderValue(newValue);
  };

  const { onNext, onPrevious } = useSendDialog();

  const { inputValue, isThrobberActive, handleInputValueChange } =
    useRecipientAddress(recipientAddress, handleRecipientAddressChange);

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
    <Container display="flex" direction="column" gap={16} width="full">
      <LeanBox
        leftImage={
          <InformationIcon
            height={16}
            width={16}
            fill={theme.palette.background.muted}
          />
        }
        pt={2}
        text={single.InfoBox.text}
        altText={single.InfoBox.altText}
        textVariant="span"
        fontSize={12}
        rightImage={<GoldQuestionMark height={14} width={14} />}
      />
      <Container display="flex" direction="column" gap={8} width="full">
        <RecipientAddress
          text={single.recipient.text}
          placeholder={single.recipient.placeholder}
          error={single.recipient.error}
          value={inputValue}
          onChange={handleInputValueChange}
          isThrobberActive={isThrobberActive}
        />
        <AmountToSend
          text={single.amount.text}
          coin={single.amount.coin}
          toggle={single.amount.toggle}
          dollar={single.amount.dollar}
          error={single.amount.error}
          isButtonEnabled={handleButtonState}
          placeholder={single.amount.placeholder}
          value={amount}
          onChange={handleAmountChange}
        />
      </Container>
      <Divider variant="horizontal" />

      <FeesSection
        type={type}
        handleButtonClick={handleButtonClick}
        title={single.fees.title}
        Buttons={Buttons}
      />
      <RecipientInput
        type={type}
        message={single.message}
        inputValue={single.fee}
        inputPostfix={single.inputPostfix}
        feesError={single.fees.error}
        value={sliderValue}
        onChange={handleSliderChange}
        Captions={Captions}
        error={single.fees.error}
      />

      {type === 'input' && (
        <Container display="flex" direction="column" gap={16} width="full">
          <ToggleSection
            text={single.toggleText.replace}
            value={isCheckedReplace}
            onChange={handleToggleChangeReplace}
            errorText={single.fees.error}
          />
          <ToggleSection
            text={single.toggleText.unconfirmed}
            value={isCheckedUnconfirmed}
            onChange={handleToggleChangeUnconfirmed}
            error
            errorText={single.fees.error}
          />
        </Container>
      )}

      <FeesDisplay
        fees={single.fees}
        image={<BitcoinIcon width={16} height={16} />}
      />
      <MessageBox type="warning" text={single.warning} />
    </Container>
  );
};
