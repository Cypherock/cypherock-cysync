import {
  LangDisplay,
  DialogBox,
  DialogBoxHeader,
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
  Slider,
  etheriumBlueIcon,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';
import { addKeyboardEvents } from '~/hooks';
import { useSendGuide } from '../../context';

export const StandardEthereum: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
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

  const buttons = ['Standard', 'Advanced'];

  return (
    <DialogBox width={500}>
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          <LangDisplay text="Send crypto" />
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Container display="flex" direction="column" gap={16} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text="Recipient" />
          </Typography>
          <Typography variant="span" $textAlign="center" color="muted">
            <LangDisplay text="Enter the amount and the address of the recipient to whom you want to send the funds" />
          </Typography>
          <LeanBox
            leftImageSrc={informationIcon}
            text="Maximum spendable amount is ~0.8436 BTC"
            textVariant="span"
            fontSize={12}
            rightImageSrc="?"
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
                  <LangDisplay text="Recipient Address" />
                </Typography>
              </Flex>
            </Flex>

            <Input
              type="text"
              name="address"
              placeholder="Enter Ethereum address"
              postfixIcon={<Image src={qrCodeIcon} alt="qr icon" />}
            />
            <Flex justify="space-between" align="center" width="full">
              <Flex align="center" gap={16}>
                <Typography
                  variant="span"
                  width="100%"
                  color="muted"
                  $fontSize={13}
                >
                  <LangDisplay text="Amount to send" />
                </Typography>
              </Flex>
              <Flex align="center" direction="row" gap={8}>
                <Typography
                  variant="span"
                  width="100%"
                  color="muted"
                  $fontSize={13}
                >
                  <LangDisplay text="Send Max" />
                </Typography>
                <Toggle checked={isChecked} onToggle={handleToggleChange} />
              </Flex>
            </Flex>

            <Divider variant="horizontal" />

            <Flex justify="space-between" align="center" width="full">
              <Flex align="center" gap={16}>
                <Typography variant="span" width="100%" $fontSize={13}>
                  <LangDisplay text="Fees" />
                </Typography>
              </Flex>
              <Flex align="center" direction="row" gap={8}>
                <ButtonGroup buttons={buttons} />
              </Flex>
            </Flex>
            <Flex justify="space-between" align="center" width="full">
              <Flex align="center" gap={16}>
                <Typography
                  variant="span"
                  width="100%"
                  color="muted"
                  $fontSize={13}
                >
                  <LangDisplay text="Gas Price" />
                </Typography>
              </Flex>
              <Flex align="center" direction="row" gap={8}>
                <MessageBox message="53.2 GWEI" />
              </Flex>
            </Flex>

            <Slider
              min={0}
              max={100}
              value={sliderValue}
              onChange={handleSliderChange}
            />

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
                  <LangDisplay text="Network Fees" />
                </Typography>
              </Flex>
              <Flex align="center" direction="row" gap={8}>
                <Typography variant="span" width="100%" $fontSize={14}>
                  <LangDisplay text="0.0002 ETH" />
                </Typography>
                <Typography
                  variant="span"
                  width="100%"
                  color="muted"
                  $fontSize={12}
                >
                  <LangDisplay text="$5.51" />
                </Typography>
              </Flex>
            </Flex>
          </Container>
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter height={101}>
        <Button variant="secondary">
          <LangDisplay text="Back" />
        </Button>
        <Button variant="primary">
          <LangDisplay text="Continue" />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
