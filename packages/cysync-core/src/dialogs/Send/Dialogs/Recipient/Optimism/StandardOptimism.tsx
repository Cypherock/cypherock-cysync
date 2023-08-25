import {
  LangDisplay,
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
  RecipientAddress,
  GoldQuestionMark,
  InformationIcon,
  OptimismIcon,
  CustomDialogBox,
} from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import { addKeyboardEvents, useRecipientAddress } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useSendDialog } from '../../../context';
import { AmountToSend } from '../AmountToSend';
import { Buttons, Captions } from '../Ethereum/StandardEthereum';
import { FeesDisplay } from '../FeesDisplay';
import { FeesSection } from '../FeesSection';
import { RecipientInput } from '../RecipientInput';

export const StandardOptimism: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(20);
  const [type, setType] = useState<'slider' | 'input'>('slider');
  const [btnState, handleButtonState] = useState(false);
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

  const handleButtonClick = (newType: 'slider' | 'input') => {
    setType(newType);
  };

  const handleSliderChange = (newValue: number) => {
    setSliderValue(newValue);
  };

  const { inputValue, isThrobberActive, handleInputValueChange } =
    useRecipientAddress(recipientAddress, handleRecipientAddressChange);

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
    <CustomDialogBox width={517}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Container display="flex" direction="column" gap={16} width="full">
          <Container display="flex" direction="column" gap={4} width="full">
            <Typography variant="h5" $textAlign="center">
              <LangDisplay text={standard.text} />
            </Typography>
            <Typography variant="span" $textAlign="center" color="muted" mb={4}>
              <LangDisplay text={standard.subText} />
            </Typography>
          </Container>
          <LeanBox
            leftImage={
              <InformationIcon
                height={16}
                width={16}
                fill={theme.palette.background.muted}
              />
            }
            text={standard.InfoBox.text}
            altText={standard.InfoBox.altText}
            textVariant="span"
            fontSize={12}
            rightImage={<GoldQuestionMark height={14} width={14} />}
          />
          <Container display="flex" direction="column" gap={8} width="full">
            <RecipientAddress
              text={standard.recipient.text}
              placeholder={standard.recipient.placeholder}
              error={standard.recipient.error}
              value={inputValue}
              onChange={handleInputValueChange}
              isThrobberActive={isThrobberActive}
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
                <GoldQuestionMark height={14} width={14} />
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
            type={type}
            handleButtonClick={handleButtonClick}
            title={standard.fees.l2.text}
            Buttons={Buttons}
          />

          <RecipientInput
            type={type}
            message={standard.message}
            inputValue={standard.fee}
            inputPostfix={standard.inputPostfix}
            feesError={standard.fees.l2.error}
            gas={standard.gas}
            limit={standard.limit}
            value={sliderValue}
            onChange={handleSliderChange}
            Captions={Captions}
            error={standard.fees.l2.error}
            coin="ethereum"
          />

          <FeesDisplay
            fees={standard.fees}
            image={<OptimismIcon height={16} width={15} />}
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
    </CustomDialogBox>
  );
};
