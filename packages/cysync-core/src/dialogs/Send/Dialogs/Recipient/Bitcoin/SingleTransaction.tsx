import {
  LeanBox,
  Container,
  Divider,
  MessageBox,
  useTheme,
  BitcoinIcon,
  AmountToSend,
  FeesDisplay,
  FeesSection,
  InputSection,
  RecipientAddress,
  ToggleSection,
} from '@cypherock/cysync-ui';
import SvgGoldQuestionMark from '@cypherock/cysync-ui/src/assets/icons/generated/GoldQuestionMark';
import SvgInformationIcon from '@cypherock/cysync-ui/src/assets/icons/generated/InformationIcon';
import React, { useState } from 'react';

import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useSendDialog } from '../../../context';
import { Buttons, Captions } from '../Ethereum';

interface SingleTransactionProps {
  handleButtonState: (shouldActivate: boolean) => void;
}

export const SingleTransaction: React.FC<SingleTransactionProps> = ({
  handleButtonState,
}) => {
  const [sliderValue, setSliderValue] = useState(20);
  const [activeButtonId, setActiveButtonId] = useState(1);
  const lang = useAppSelector(selectLanguage);
  const { single } = lang.strings.send.bitcoin.info.dialogBox;
  const theme = useTheme();

  const handleButtonClick = (id: number) => {
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
    <Container display="flex" direction="column" gap={16} width="full">
      <LeanBox
        leftImage={
          <SvgInformationIcon
            height={16}
            width={16}
            fill={theme.palette.background.muted}
          />
        }
        text={single.InfoBox.text}
        altText={single.InfoBox.altText}
        textVariant="span"
        fontSize={12}
        icon={<SvgGoldQuestionMark height={14} width={14} />}
      />
      <Container display="flex" direction="column" gap={8} width="full">
        <RecipientAddress
          text={single.recipient.text}
          placeholder={single.recipient.placeholder}
          error={single.recipient.error}
        />
        <AmountToSend
          text={single.amount.text}
          coin={single.amount.coin}
          toggle={single.amount.toggle}
          dollar={single.amount.dollar}
          error={single.amount.error}
          isButtonEnabled={handleButtonState}
          placeholder={single.amount.placeholder}
        />
      </Container>
      <Divider variant="horizontal" />

      <FeesSection
        activeButtonId={activeButtonId}
        handleButtonClick={handleButtonClick}
        single={single}
        Buttons={Buttons}
      />
      <InputSection
        activeButtonId={activeButtonId}
        single={single}
        sliderValue={sliderValue}
        handleSliderChange={handleSliderChange}
        Captions={Captions}
        error={single.fees.error}
      />

      {activeButtonId === 2 && (
        <ToggleSection single={single} error={single.fees.error} />
      )}

      <FeesDisplay
        fees={single.fees}
        image={<BitcoinIcon width={16} height={16} />}
      />
      <MessageBox type="warning" text={single.warning} />
    </Container>
  );
};
