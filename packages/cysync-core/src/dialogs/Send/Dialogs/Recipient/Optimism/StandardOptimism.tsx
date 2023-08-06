import React, { useState } from 'react';
import {
  LangDisplay,
  DialogBox,
  DialogBoxFooter,
  Button,
  DialogBoxBody,
  Typography,
  LeanBox,
  Flex,
  Container,
  Divider,
  MessageBox,
  useTheme,
  AmountToSend,
  RecipientAddress,
  FeesSection,
  InputSection,
  FeesDisplay,
} from '@cypherock/cysync-ui';
import SvgGoldQuestionMark from '@cypherock/cysync-ui/src/assets/icons/generated/GoldQuestionMark';
import SvgInformationIcon from '@cypherock/cysync-ui/src/assets/icons/generated/InformationIcon';
import SvgOptimism from '@cypherock/cysync-ui/src/assets/icons/generated/Optimism';
import { addKeyboardEvents, useButtonState } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { useSendDialog } from '../../../context';
import { Buttons, Captions } from '../Ethereum/StandardEthereum';

export const StandardOptimism: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(20);
  const [activeButtonId, setActiveButtonId] = useState(1);
  const [btnState, handleButtonState] = useButtonState();
  const lang = useAppSelector(selectLanguage);
  const button = lang.strings.buttons;
  const standard = lang.strings.send.optimism.info.dialogBox;
  const theme = useTheme();

  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleRecipientAddressChange = (value: string) => {
    setRecipientAddress(value);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
  };

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
            leftImage={
              <SvgInformationIcon
                height={16}
                width={16}
                fill={theme.palette.background.muted}
              />
            }
            text={standard.InfoBox.text}
            altText={standard.InfoBox.altText}
            textVariant="span"
            fontSize={12}
            rightImage={<SvgGoldQuestionMark height={14} width={14} />}
          />
          <Container display="flex" direction="column" gap={8} width="full">
            <RecipientAddress
              text={standard.recipient.text}
              placeholder={standard.recipient.placeholder}
              error={standard.recipient.error}
              value={recipientAddress}
              onChange={handleRecipientAddressChange}
            />
            <AmountToSend
              text={standard.amount.text}
              coin={standard.amount.coin}
              toggle={standard.amount.toggle}
              dollar={standard.amount.dollar}
              error={standard.amount.error}
              isButtonEnabled={handleButtonState}
              placeholder={standard.amount.placeholder}
              value={amount}
              onChange={handleAmountChange}
            />
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
            {!standard.fees.l1.error && (
              <Typography
                variant="span"
                width="100%"
                color="error"
                $alignSelf="start"
                $fontSize={14}
              >
                <LangDisplay text={standard.fees.l1.error} />
              </Typography>
            )}
          </Container>

          <Divider variant="horizontal" />

          <FeesSection
            activeButtonId={activeButtonId}
            handleButtonClick={handleButtonClick}
            title={standard.fees.l2.text}
            Buttons={Buttons}
          />

          <InputSection
            activeButtonId={activeButtonId}
            single={standard}
            sliderValue={sliderValue}
            handleSliderChange={handleSliderChange}
            Captions={Captions}
            error={standard.fees.l2.error}
            gas
          />

          <FeesDisplay
            fees={standard.fees}
            image={<SvgOptimism height={16} width={15} />}
          />

          <MessageBox type="warning" text={standard.warning} />
        </Container>
      </DialogBoxBody>
      <DialogBoxFooter height={101}>
        <Button variant="secondary">
          <LangDisplay text={button.back} />
        </Button>
        <Button variant="primary" disabled={!btnState}>
          <LangDisplay text={button.continue} />
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
