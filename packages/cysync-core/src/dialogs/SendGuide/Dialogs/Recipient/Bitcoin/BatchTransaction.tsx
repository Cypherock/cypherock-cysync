import {
  LangDisplay,
  Typography,
  Image,
  LeanBox,
  informationIcon,
  Input,
  Flex,
  Container,
  Toggle,
  Divider,
  ButtonGroup,
  MessageBox,
  InfoBox,
  Slider,
  SliderCaption,
  ButtonAttributes,
  bitcoinIcon,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';
import { addKeyboardEvents } from '~/hooks';
import { useSendGuide } from '../../../context';
import SvgGoldQuestionMark from '@cypherock/cysync-ui/src/assets/icons/generated/GoldQuestionMark';
import { selectLanguage, useAppSelector } from '~/store';

export const BatchTransaction: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [sliderValue, setSliderValue] = useState(20);
  const [activeButtonId, setActiveButtonId] = useState(1);
  const lang = useAppSelector(selectLanguage);

  const { batch } = lang.strings.send.bitcoin.info.dialogBox;

  const handleButtonClick = (id: number) => {
    setActiveButtonId(id);
  };

  const handleSliderChange = (newValue: number) => {
    setSliderValue(newValue);
  };
  const handleToggleChange = (checked: boolean) => {
    setIsChecked(checked);
  };
  const { onNext, onPrevious } = useSendGuide();

  const keyboardActions = {
    ArrowRight: () => {
      onNext();
    },
    ArrowLeft: () => {
      onPrevious();
    },
  };

  addKeyboardEvents(keyboardActions);

  const buttons: ButtonAttributes[] = [
    { id: 1, label: 'Standard' },
    { id: 2, label: 'Advanced' },
  ];

  const captions = [
    { id: 1, name: 'Min' },
    { id: 2, name: 'Average' },
    { id: 3, name: 'Max' },
  ];

  return (
    <Container display="flex" direction="column" gap={16} width="full">
      <LeanBox
        leftImageSrc={informationIcon}
        text={batch.InfoBox.text}
        altText={batch.InfoBox.altText}
        textVariant="span"
        fontSize={12}
        icon={<SvgGoldQuestionMark height={14} width={14} />}
      />

      <Divider variant="horizontal" />
      <Flex justify="space-between" align="center" width="full">
        <Flex align="center" gap={8}>
          <Typography variant="span" width="100%" $fontSize={13}>
            <LangDisplay text={batch.fees.title} />
          </Typography>
          <SvgGoldQuestionMark height={14} width={14} />
        </Flex>
        <Flex align="center" direction="row" gap={8}>
          <ButtonGroup
            buttons={buttons}
            activeButtonId={activeButtonId}
            onButtonClick={handleButtonClick}
          />
        </Flex>
      </Flex>
      <Container display="flex" direction="column" gap={16} width="full">
        <Flex justify="flex-end" align="center" width="full">
          {activeButtonId === 1 && <InfoBox text={batch.message} />}
        </Flex>

        {activeButtonId === 2 && (
          <Input type="text" name="address" postfixIcon={batch.inputPostfix} />
        )}

        {activeButtonId === 1 && (
          <>
            <Slider initialValue={sliderValue} onChange={handleSliderChange} />
            <SliderCaption captions={captions} />
            <Typography
              variant="span"
              width="100%"
              color="error"
              $alignSelf="start"
              $fontSize={12}
            >
              <LangDisplay text={batch.fees.error} />
            </Typography>
          </>
        )}
      </Container>

      {activeButtonId === 2 && (
        <Container display="flex" direction="column" gap={16} width="full">
          <Flex justify="space-between" align="center" width="full">
            <Flex align="center" gap={8}>
              <Typography
                variant="span"
                width="100%"
                color="muted"
                $fontSize={13}
              >
                <LangDisplay text={batch.toggleText.replace} />
              </Typography>
            </Flex>
            <Flex align="center" direction="row" gap={8}>
              <Toggle checked={isChecked} onToggle={handleToggleChange} />
            </Flex>
          </Flex>

          <Flex justify="space-between" align="center" width="full">
            <Flex align="center" gap={8}>
              <Typography
                variant="span"
                width="100%"
                color="muted"
                $fontSize={13}
              >
                <LangDisplay text={batch.toggleText.unconfirmed} />
              </Typography>
            </Flex>
            <Flex align="center" direction="row" gap={8}>
              <Toggle checked={isChecked} onToggle={handleToggleChange} />
            </Flex>
          </Flex>

          <Typography
            variant="span"
            width="100%"
            color="error"
            $alignSelf="start"
            $fontSize={12}
          >
            <LangDisplay text={batch.fees.error} />
          </Typography>
        </Container>
      )}

      <Flex justify="space-between" align="center" width="full">
        <Flex align="center" gap={8}>
          <Image
            src={bitcoinIcon}
            alt="Left Image"
            width="11px"
            height="16px"
          />
          <Typography variant="span" width="100%" color="muted" $fontSize={13}>
            <LangDisplay text={batch.fees.network} />
          </Typography>
        </Flex>
        <Flex align="center" direction="row" gap={8}>
          <Typography variant="span" width="100%" $fontSize={14}>
            <LangDisplay text={batch.fees.btc} />
          </Typography>
          <Typography variant="span" width="100%" color="muted" $fontSize={12}>
            <LangDisplay text={batch.fees.usd} />
          </Typography>
        </Flex>
      </Flex>
      <MessageBox type="warning" text={batch.warning} />
    </Container>
  );
};
