import {
  LeanBox,
  Container,
  Divider,
  MessageBox,
  useTheme,
  ToggleSection,
  BitcoinIcon,
  GoldQuestionMark,
  InformationIcon,
  useToggle,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { BatchTransactionBody } from './BatchTransactionBody';

import { useSendDialog } from '../../../context';
import { Buttons, Captions } from '../Ethereum';
import { FeesDisplay } from '../FeesDisplay';
import { FeesSection } from '../FeesSection';
import { RecipientInput } from '../RecipientInput';

export const BatchTransaction: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(20);
  const [type, setType] = useState<'slider' | 'input'>('slider');
  const theme = useTheme();
  const lang = useAppSelector(selectLanguage);

  const {
    isChecked: isCheckedReplace,
    handleToggleChange: handleToggleChangeReplace,
  } = useToggle();
  const {
    isChecked: isCheckedUnconfirmed,
    handleToggleChange: handleToggleChangeUnconfirmed,
  } = useToggle();

  const { batch } = lang.strings.send.bitcoin.info.dialogBox;
  const { single } = lang.strings.send.bitcoin.info.dialogBox;

  const handleButtonClick = (newType: 'slider' | 'input') => {
    setType(newType);
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
    <Container display="flex" direction="column" gap={16} width="full">
      <LeanBox
        leftImage={
          <InformationIcon
            height={16}
            width={16}
            fill={theme.palette.background.muted}
          />
        }
        text={batch.InfoBox.text}
        altText={batch.InfoBox.altText}
        textVariant="span"
        fontSize={12}
        rightImage={<GoldQuestionMark height={14} width={14} />}
      />
      <BatchTransactionBody
        text={batch.button}
        recipient={single.recipient}
        amount={single.amount}
      />

      <Divider variant="horizontal" />
      <FeesSection
        type={type}
        handleButtonClick={handleButtonClick}
        title={batch.fees.title}
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
            errorText={single.fees.error}
          />
        </Container>
      )}

      <FeesDisplay
        fees={single.fees}
        image={<BitcoinIcon width={16} height={16} />}
      />
      <MessageBox type="warning" text={batch.warning} />
    </Container>
  );
};
