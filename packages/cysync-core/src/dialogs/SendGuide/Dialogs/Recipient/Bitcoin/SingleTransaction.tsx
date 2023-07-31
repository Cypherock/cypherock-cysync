import {
  LangDisplay,
  Typography,
  Image,
  LeanBox,
  informationIcon,
  Input,
  qrCodeIcon,
  Flex,
  Container,
  Toggle,
  Divider,
  ButtonGroup,
  MessageBox,
  InfoBox,
  Slider,
  SliderCaption,
  bitcoinIcon,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';
import { addKeyboardEvents } from '~/hooks';
import { useSendGuide } from '../../../context';
import SvgDoubleArrow from '@cypherock/cysync-ui/src/assets/icons/generated/DoubleArrow';
import SvgGoldQuestionMark from '@cypherock/cysync-ui/src/assets/icons/generated/GoldQuestionMark';
import { Buttons, Captions } from '../Ethereum';
import { selectLanguage, useAppSelector } from '~/store';

export const SingleTransaction: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [sliderValue, setSliderValue] = useState(20);
  const [activeButtonId, setActiveButtonId] = useState(1);
  const lang = useAppSelector(selectLanguage);
  const { single } = lang.strings.send.bitcoin.info.dialogBox;

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

  return (
    <Container display="flex" direction="column" gap={16} width="full">
      <LeanBox
        leftImageSrc={informationIcon}
        text={single.InfoBox.text}
        altText={single.InfoBox.altText}
        textVariant="span"
        fontSize={12}
        icon={<SvgGoldQuestionMark height={14} width={14} />}
      />
      <Container display="flex" direction="column" gap={8} width="full">
        <Flex justify="space-between" align="center" width="full">
          <Flex align="center" gap={16}>
            <Typography
              variant="span"
              width="100%"
              color="muted"
              $fontSize={13}
            >
              <LangDisplay text={single.recipient.text} />
            </Typography>
          </Flex>
        </Flex>

        <Input
          type="text"
          name="address"
          placeholder={single.recipient.placeholder}
          postfixIcon={<Image src={qrCodeIcon} alt="qr icon" />}
        />
        <Typography
          variant="span"
          width="100%"
          color="error"
          $alignSelf="start"
          $fontSize={12}
        >
          <LangDisplay text={single.recipient.error} />
        </Typography>
        <Flex justify="space-between" align="center" width="full">
          <Flex align="center" gap={16}>
            <Typography
              variant="span"
              width="100%"
              color="muted"
              $fontSize={13}
            >
              <LangDisplay text={single.amount.text} />
            </Typography>
          </Flex>
          <Flex align="center" direction="row" gap={8}>
            <Typography
              variant="span"
              width="100%"
              color="muted"
              $fontSize={13}
            >
              <LangDisplay text={single.amount.toggle} />
            </Typography>
            <Toggle checked={isChecked} onToggle={handleToggleChange} />
          </Flex>
        </Flex>
        <Flex justify="space-between" gap={8} align="center" width="full">
          <Input type="text" name="address" postfixIcon={single.amount.eth} />
          <SvgDoubleArrow height={22} width={22} />
          <Input
            type="text"
            name="address"
            postfixIcon={single.amount.dollar}
          />
        </Flex>
        <Typography
          variant="span"
          width="100%"
          color="error"
          $alignSelf="start"
          $fontSize={12}
        >
          <LangDisplay text={single.amount.error} />
        </Typography>
      </Container>
      <Divider variant="horizontal" />
      <Flex justify="space-between" align="center" width="full">
        <Flex align="center" gap={8}>
          <Typography variant="span" width="100%" $fontSize={13}>
            <LangDisplay text={single.fees.title} />
          </Typography>
          <SvgGoldQuestionMark height={14} width={14} />
        </Flex>
        <Flex align="center" direction="row" gap={8}>
          <ButtonGroup
            buttons={Buttons}
            activeButtonId={activeButtonId}
            onButtonClick={handleButtonClick}
          />
        </Flex>
      </Flex>
      <Container display="flex" direction="column" gap={16} width="full">
        <Flex justify="flex-end" align="center" width="full">
          {activeButtonId === 1 && <InfoBox text={single.message} />}
        </Flex>

        {activeButtonId === 2 && (
          <Input type="text" name="address" postfixIcon={single.inputPostfix} />
        )}

        {activeButtonId === 1 && (
          <>
            <Slider initialValue={sliderValue} onChange={handleSliderChange} />
            <SliderCaption captions={Captions} />
            <Typography
              variant="span"
              width="100%"
              color="error"
              $alignSelf="start"
              $fontSize={12}
            >
              <LangDisplay text={single.fees.error} />
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
                <LangDisplay text={single.toggleText.replace} />
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
                <LangDisplay text={single.toggleText.unconfirmed} />
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
            <LangDisplay text={single.fees.error} />
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
            <LangDisplay text={single.fees.network} />
          </Typography>
        </Flex>
        <Flex align="center" direction="row" gap={8}>
          <Typography variant="span" width="100%" $fontSize={14}>
            <LangDisplay text={single.fees.btc} />
          </Typography>
          <Typography variant="span" width="100%" color="muted" $fontSize={12}>
            <LangDisplay text={single.fees.usd} />
          </Typography>
        </Flex>
      </Flex>
      <MessageBox type="warning" text={single.warning} />
    </Container>
  );
};
