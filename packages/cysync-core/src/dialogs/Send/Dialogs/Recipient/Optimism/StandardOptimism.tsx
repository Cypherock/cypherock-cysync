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
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';
import { addKeyboardEvents } from '~/hooks';
import { useSendDialog } from '../../../context';
import SvgDoubleArrow from '@cypherock/cysync-ui/src/assets/icons/generated/DoubleArrow';
import SvgOptimism from '@cypherock/cysync-ui/src/assets/icons/generated/Optimism';
import SvgGoldQuestionMark from '@cypherock/cysync-ui/src/assets/icons/generated/GoldQuestionMark';
import { Buttons, Captions } from '../Ethereum/StandardEthereum';
import { selectLanguage, useAppSelector } from '~/store';

export const StandardOptimism: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [sliderValue, setSliderValue] = useState(20);
  const [activeButtonId, setActiveButtonId] = useState(1);
  const lang = useAppSelector(selectLanguage);
  const button = lang.strings.buttons;
  const standard = lang.strings.send.optimism.info.dialogBox;

  const handleButtonClick = (id: number) => {
    setActiveButtonId(id);
  };

  const handleSliderChange = (newValue: number) => {
    setSliderValue(newValue);
  };
  const handleToggleChange = (checked: boolean) => {
    setIsChecked(checked);
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
            <LangDisplay text={standard.text} />
          </Typography>
          <Typography variant="span" $textAlign="center" color="muted">
            <LangDisplay text={standard.subText} />
          </Typography>
          <LeanBox
            leftImage={informationIcon}
            text={standard.InfoBox.text}
            altText={standard.InfoBox.altText}
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
                  <LangDisplay text={standard.recipient.text} />
                </Typography>
              </Flex>
            </Flex>

            <Input
              type="text"
              name="address"
              placeholder={standard.recipient.placeholder}
              postfixIcon={<Image src={qrCodeIcon} alt="qr icon" />}
            />
            <Typography
              variant="span"
              width="100%"
              color="error"
              $alignSelf="start"
              $fontSize={12}
            >
              <LangDisplay text={standard.recipient.error} />
            </Typography>
            <Flex justify="space-between" align="center" width="full">
              <Flex align="center" gap={16}>
                <Typography
                  variant="span"
                  width="100%"
                  color="muted"
                  $fontSize={13}
                >
                  <LangDisplay text={standard.amount.text} />
                </Typography>
              </Flex>
              <Flex align="center" direction="row" gap={8}>
                <Typography
                  variant="span"
                  width="100%"
                  color="muted"
                  $fontSize={13}
                >
                  <LangDisplay text={standard.amount.toggle} />
                </Typography>
                <Toggle checked={isChecked} onToggle={handleToggleChange} />
              </Flex>
            </Flex>
            <Flex justify="space-between" gap={8} align="center" width="full">
              <Input
                type="text"
                name="address"
                postfixIcon={standard.amount.eth}
              />
              <SvgDoubleArrow height={22} width={22} />
              <Input
                type="text"
                name="address"
                postfixIcon={standard.amount.dollar}
              />
            </Flex>
            <Typography
              variant="span"
              width="100%"
              color="error"
              $alignSelf="start"
              $fontSize={12}
            >
              <LangDisplay text={standard.amount.error} />
            </Typography>
          </Container>
          <Divider variant="horizontal" />

          <Container display="flex" direction="column" gap={8} width="full">
            <Flex justify="space-between" align="center" width="full">
              <Flex align="center" gap={8}>
                <Typography variant="span" width="100%" $fontSize={14}>
                  <LangDisplay text={standard.fees.l1.text} />
                </Typography>
                <SvgGoldQuestionMark height={14} width={14} />
              </Flex>
              <Flex align="center" direction="row" gap={8}>
                <Typography variant="span" width="100%" $fontSize={13}>
                  <LangDisplay text={standard.fees.l1.fee} />
                </Typography>
              </Flex>
            </Flex>
            <Typography
              variant="span"
              width="100%"
              color="error"
              $alignSelf="start"
              $fontSize={12}
            >
              <LangDisplay text={standard.fees.l1.error} />
            </Typography>
          </Container>

          <Divider variant="horizontal" />

          <Flex justify="space-between" align="center" width="full">
            <Flex align="center" gap={8}>
              <Typography variant="span" width="100%" $fontSize={14}>
                <LangDisplay text={standard.fees.l2.text} />
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
                  <LangDisplay text={standard.gas} />
                </Typography>
                <SvgGoldQuestionMark height={14} width={14} />
              </Flex>
              {activeButtonId === 1 && (
                <Flex align="center" direction="row" gap={8}>
                  <InfoBox text={standard.message} />
                </Flex>
              )}
            </Flex>

            {activeButtonId === 2 && (
              <Input
                type="text"
                name="address"
                postfixIcon={standard.inputPostfix}
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
                  <LangDisplay text={standard.fees.l2.error} />
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
                    <LangDisplay text={standard.limit} />
                  </Typography>
                  <SvgGoldQuestionMark height={14} width={14} />
                </Flex>
              </Flex>

              <Input type="text" name="address" />
              <Typography
                variant="span"
                width="100%"
                color="error"
                $alignSelf="start"
                $fontSize={12}
              >
                <LangDisplay text={standard.fees.l2.error} />
              </Typography>
            </Container>
          )}

          <Flex justify="space-between" align="center" width="full">
            <Flex align="center" gap={8}>
              <SvgOptimism height={16} width={15} />
              <Typography
                variant="span"
                width="100%"
                color="muted"
                $fontSize={13}
              >
                <LangDisplay text={standard.fees.network} />
              </Typography>
            </Flex>
            <Flex align="center" direction="row" gap={8}>
              <Typography variant="span" width="100%" $fontSize={14}>
                <LangDisplay text={standard.fees.fee} />
              </Typography>
              <Typography
                variant="span"
                width="100%"
                color="muted"
                $fontSize={12}
              >
                <LangDisplay text={standard.fees.usd} />
              </Typography>
            </Flex>
          </Flex>
          <MessageBox type="warning" text={standard.warning} />
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
