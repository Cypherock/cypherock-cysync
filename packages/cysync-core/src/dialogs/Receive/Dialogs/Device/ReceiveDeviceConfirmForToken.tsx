import {
  LangDisplay,
  DialogBox,
  DialogBoxBody,
  Typography,
  Image,
  Container,
  questionMarkGoldIcon,
  arrowGoldenForward,
  checkIcon,
  confirmIcon,
  LeanBoxContainer,
  LeanBox,
  informationWhiteIcon,
  InformationBox,
  Throbber,
} from '@cypherock/cysync-ui';
import React from 'react';

import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useReceiveDialog } from '../../context';

export const ReceiveDeviceConfirmForToken: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const connect = lang.strings.receive.deviceConfirmForToken.info.dialogBox;
  const { onNext, onPrevious } = useReceiveDialog();

  const dataArray = [
    {
      id: '1',
      leftImage: (
        <Image src={arrowGoldenForward} alt="arrowGoldenForward icon" />
      ),
      text: 'Fetching a new address from the wallet',
      rightImage: <Image src={checkIcon} alt="check icon" />,
    },
    {
      id: '2',
      leftImage: (
        <Image src={arrowGoldenForward} alt="arrowGoldenForward icon" />
      ),
      text: 'Verify the account on the device',
      rightImage: <Throbber size={15} strokeWidth={2} />,
    },
    {
      id: '3',
      leftImage: (
        <Image src={arrowGoldenForward} alt="arrowGoldenForward icon" />
      ),
      text: 'Enter passphrase',
    },
    {
      id: '4',
      leftImage: (
        <Image src={arrowGoldenForward} alt="arrowGoldenForward icon" />
      ),
      text: 'Enter the PIN and tap any card',
    },
  ];

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
    <DialogBox width={600}>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={confirmIcon} alt="Verify Coin" />
        <Container display="flex" direction="column" width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={connect.header} />
          </Typography>
          <Typography
            variant="span"
            $textAlign="center"
            $fontSize={14}
            $fontWeight="normal"
            color="muted"
          >
            <LangDisplay text={connect.subheader} />
          </Typography>
        </Container>
        <LeanBoxContainer>
          {dataArray.map(data => (
            <LeanBox
              key={data.id}
              leftImage={data.leftImage}
              rightImage={data.rightImage}
              text={data.text}
              id={data.id}
            />
          ))}
        </LeanBoxContainer>
        <InformationBox
          leftImage={
            <Image src={informationWhiteIcon} alt="question mark icon" />
          }
          text={connect.InfoBox.text}
          rightImage={
            <Image src={questionMarkGoldIcon} alt="question mark icon" />
          }
        />
      </DialogBoxBody>
    </DialogBox>
  );
};
