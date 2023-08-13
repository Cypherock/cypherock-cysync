import {
  LeanBox,
  Container,
  Divider,
  MessageBox,
  useTheme,
  BatchTransactionBody,
  FeesSection,
  InputSection,
  ToggleSection,
  FeesDisplay,
  BitcoinIcon,
} from '@cypherock/cysync-ui';
import SvgGoldQuestionMark from '@cypherock/cysync-ui/src/assets/icons/generated/GoldQuestionMark';
import SvgInformationIcon from '@cypherock/cysync-ui/src/assets/icons/generated/InformationIcon';
import React, { useState } from 'react';

import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useSendDialog } from '../../../context';
import { Buttons, Captions } from '../Ethereum';

export const BatchTransaction: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(20);
  const [activeButtonId, setActiveButtonId] = useState(1);
  const theme = useTheme();
  const lang = useAppSelector(selectLanguage);

  const { batch } = lang.strings.send.bitcoin.info.dialogBox;
  const { single } = lang.strings.send.bitcoin.info.dialogBox;

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
        text={batch.InfoBox.text}
        altText={batch.InfoBox.altText}
        textVariant="span"
        fontSize={12}
        rightImage={<SvgGoldQuestionMark height={14} width={14} />}
      />
      <BatchTransactionBody text={batch.button} batch={single} />

      <Divider variant="horizontal" />
      <FeesSection
        activeButtonId={activeButtonId}
        handleButtonClick={handleButtonClick}
        title={batch.fees.title}
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
      <MessageBox type="warning" text={batch.warning} />
    </Container>
  );
};
