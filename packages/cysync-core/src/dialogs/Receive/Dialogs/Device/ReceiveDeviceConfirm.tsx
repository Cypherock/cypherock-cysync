import {
  LangDisplay,
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  Typography,
  Image,
  Container,
  arrowGoldenForward,
  checkIcon,
  confirmIcon,
  LeanBoxContainer,
  LeanBox,
} from '@cypherock/cysync-ui';
import { spinnerGoldIcon } from '@cypherock/cysync-ui/src';
import React from 'react';

import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useReceiveDialog } from '../../context';

export const ReceiveDeviceConfirm: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const connect = lang.strings.receive.deviceConfirm.info.dialogBox;
  const { onNext, onPrevious } = useReceiveDialog();

  const dataArray = [
    {
      id: '1',
      leftImage: arrowGoldenForward,
      text: 'Fetching a new address from the wallet',
      rightImageSrc: checkIcon,
    },
    {
      id: '2',
      leftImage: arrowGoldenForward,

      text: 'Verify the account on the X1 Vault',
      rightImageSrc: spinnerGoldIcon,
      animate: true,
    },
    {
      id: '3',
      leftImage: arrowGoldenForward,
      text: 'Enter passphrase',
    },
    {
      id: '4',
      leftImage: arrowGoldenForward,
      text: 'Enter the PIN and tap any X1 card',
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
      <DialogBoxHeader height={56} width={600}>
        <Typography variant="fineprint" width="100%" color="muted">
          <LangDisplay text={connect.title} />
        </Typography>
      </DialogBoxHeader>
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
              rightImageSrc={data.rightImageSrc}
              text={data.text}
              id={data.id}
            />
          ))}
        </LeanBoxContainer>
      </DialogBoxBody>
    </DialogBox>
  );
};
