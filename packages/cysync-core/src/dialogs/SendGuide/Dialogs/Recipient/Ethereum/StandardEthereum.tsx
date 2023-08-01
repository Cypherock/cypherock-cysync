import {
  LangDisplay,
  DialogBox,
  DialogBoxFooter,
  Button,
  DialogBoxBody,
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
  etheriumBlueIcon,
  ButtonAttributes,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';
import { addKeyboardEvents } from '~/hooks';
import { useSendGuide } from '../../../context';
import SvgDoubleArrow from '@cypherock/cysync-ui/src/assets/icons/generated/DoubleArrow';
import SvgGoldQuestionMark from '@cypherock/cysync-ui/src/assets/icons/generated/GoldQuestionMark';
import { selectLanguage, useAppSelector } from '~/store';

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
  const [isChecked, setIsChecked] = useState(false);
  const [sliderValue, setSliderValue] = useState(20);
  const [activeButtonId, setActiveButtonId] = useState(1);
  const lang = useAppSelector(selectLanguage);
  const button = lang.strings.buttons;
  const eth = lang.strings.send.ethereum.info.dialogBox;

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
    <DialogBox width={517}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Container display="flex" direction="column" gap={16} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={eth.text} />
          </Typography>
          <Typography variant="span" $textAlign="center" color="muted">
            <LangDisplay text={eth.subText} />
          </Typography>
          <LeanBox
            leftImageSrc={informationIcon}
            text={eth.InfoBox.text}
            altText={eth.InfoBox.altText}
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
                  <LangDisplay text={eth.recipient.text} />
                </Typography>
              </Flex>
            </Flex>

            <Input
              type="text"
              name="address"
              placeholder={eth.recipient.placeholder}
              postfixIcon={<Image src={qrCodeIcon} alt="qr icon" />}
            />
            <Typography
              variant="span"
              width="100%"
              color="error"
              $alignSelf="start"
              $fontSize={12}
            >
              <LangDisplay text={eth.recipient.error} />
            </Typography>
            <Flex justify="space-between" align="center" width="full">
              <Flex align="center" gap={16}>
                <Typography
                  variant="span"
                  width="100%"
                  color="muted"
                  $fontSize={13}
                >
                  <LangDisplay text={eth.amount.text} />
                </Typography>
              </Flex>
              <Flex align="center" direction="row" gap={8}>
                <Typography
                  variant="span"
                  width="100%"
                  color="muted"
                  $fontSize={13}
                >
                  <LangDisplay text={eth.amount.toggle} />
                </Typography>
                <Toggle checked={isChecked} onToggle={handleToggleChange} />
              </Flex>
            </Flex>
            <Flex justify="space-between" gap={8} align="center" width="full">
              <Input type="text" name="address" postfixIcon={eth.amount.eth} />
              <SvgDoubleArrow height={22} width={22} />
              <Input
                type="text"
                name="address"
                postfixIcon={eth.amount.dollar}
              />
            </Flex>
            <Typography
              variant="span"
              width="100%"
              color="error"
              $alignSelf="start"
              $fontSize={12}
            >
              <LangDisplay text={eth.amount.error} />
            </Typography>
          </Container>
          <Divider variant="horizontal" />
          <Flex justify="space-between" align="center" width="full">
            <Flex align="center" gap={8}>
              <Typography variant="span" width="100%" $fontSize={13}>
                <LangDisplay text={eth.fees.title} />
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
            <Flex justify="space-between" align="center" width="full">
              <Flex align="center" gap={8}>
                <Typography
                  variant="span"
                  width="100%"
                  color="muted"
                  $fontSize={13}
                >
                  <LangDisplay text={eth.gas} />
                </Typography>
                <SvgGoldQuestionMark height={14} width={14} />
              </Flex>
              {activeButtonId === 1 && (
                <Flex align="center" direction="row" gap={8}>
                  <InfoBox text={eth.message} />
                </Flex>
              )}
            </Flex>

            {activeButtonId === 2 && (
              <Input
                type="text"
                name="address"
                postfixIcon={eth.inputPostfix}
              />
            )}

            {activeButtonId === 1 && (
              <>
                <Slider
                  initialValue={sliderValue}
                  onChange={handleSliderChange}
                />
                <SliderCaption captions={Captions} />
                <Typography
                  variant="span"
                  width="100%"
                  color="error"
                  $alignSelf="start"
                  $fontSize={12}
                >
                  <LangDisplay text={eth.fees.error} />
                </Typography>
              </>
            )}
          </Container>

          {activeButtonId === 2 && (
            <Container display="flex" direction="column" gap={8} width="full">
              <Flex justify="space-between" align="center" width="full">
                <Flex align="center" gap={8}>
                  <Typography
                    variant="span"
                    width="100%"
                    color="muted"
                    $fontSize={13}
                  >
                    <LangDisplay text={eth.limit} />
                  </Typography>
                  <SvgGoldQuestionMark height={14} width={14} />
                </Flex>
              </Flex>

              <Input type="text" name="address" />
            </Container>
          )}

          <Flex justify="space-between" align="center" width="full">
            <Flex align="center" gap={8}>
              <Image
                src={etheriumBlueIcon}
                alt="Left Image"
                width="11px"
                height="16px"
              />
              <Typography
                variant="span"
                width="100%"
                color="muted"
                $fontSize={13}
              >
                <LangDisplay text={eth.fees.network} />
              </Typography>
            </Flex>
            <Flex align="center" direction="row" gap={8}>
              <Typography variant="span" width="100%" $fontSize={14}>
                <LangDisplay text={eth.fees.fee} />
              </Typography>
              <Typography
                variant="span"
                width="100%"
                color="muted"
                $fontSize={12}
              >
                <LangDisplay text={eth.fees.usd} />
              </Typography>
            </Flex>
          </Flex>
          <MessageBox type="warning" text={eth.warning} />
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter height={101}>
        <Button variant="secondary">
          <LangDisplay text={button.back} />
        </Button>
        <Button variant="primary">
          <LangDisplay text={button.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
