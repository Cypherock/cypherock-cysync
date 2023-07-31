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
} from '@cypherock/cysync-ui';
import React from 'react';

import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useReceiveDialog } from '../../context';

export const ReceiveDeviceConfirmForToken: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const connect = lang.strings.receive.deviceConfirmForToken.info.dialogBox;
  const imageIcon = questionMarkGoldIcon;
  const { onNext, onPrevious } = useReceiveDialog();

  const dataArray = [
    {
      id: '1',
      leftImageSrc: arrowGoldenForward,
      text: 'Fetching a new address from the wallet',
      rightImageSrc: checkIcon,
    },
    {
      id: '2',
      leftImageSrc: arrowGoldenForward,
      text: 'Verify the account on the device',
      throbber: true,
    },
    {
      id: '3',
      leftImageSrc: arrowGoldenForward,
      text: 'Enter passphrase',
    },
    {
      id: '4',
      leftImageSrc: arrowGoldenForward,
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
              leftImageSrc={data.leftImageSrc}
              rightImageSrc={data.rightImageSrc}
              text={data.text}
              id={data.id}
            />
          ))}
        </LeanBoxContainer>
        <InformationBox
          imagePath={informationWhiteIcon}
          text={connect.InfoBox.text}
          iconImagePath={imageIcon}
        />
      </DialogBoxBody>
    </DialogBox>
  );
};
