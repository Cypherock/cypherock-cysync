import {
  LangDisplay,
  Typography,
  Image,
  LeanBox,
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
  useTheme,
  BatchTransactionBody,
  useToggle,
} from '@cypherock/cysync-ui';
import SvgGoldQuestionMark from '@cypherock/cysync-ui/src/assets/icons/generated/GoldQuestionMark';
import SvgInformationIcon from '@cypherock/cysync-ui/src/assets/icons/generated/InformationIcon';
import React, { useState } from 'react';

import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useSendDialog } from '../../../context';

export const BatchTransaction: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(20);
  const [activeButtonId, setActiveButtonId] = useState(1);
  const theme = useTheme();
  const lang = useAppSelector(selectLanguage);
  const replaceToggle = useToggle(false);
  const unconfirmedToggle = useToggle(false);

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
        icon={<SvgGoldQuestionMark height={14} width={14} />}
      />
      <BatchTransactionBody text={batch.button} batch={single} />

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
              <Toggle
                checked={replaceToggle.isChecked}
                onToggle={replaceToggle.handleToggleChange}
              />
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
              <Toggle
                checked={unconfirmedToggle.isChecked}
                onToggle={unconfirmedToggle.handleToggleChange}
              />
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
