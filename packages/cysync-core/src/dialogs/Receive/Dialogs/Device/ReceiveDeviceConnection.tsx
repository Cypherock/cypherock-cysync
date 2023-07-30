import {
  LangDisplay,
  disconnectedIcon,
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  Typography,
  Image,
  Container,
  DialogBoxFooter,
  Button,
} from '@cypherock/cysync-ui';
import React from 'react';

import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useReceiveDialog } from '../../context';

export const ReceiveDeviceConnection: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const connect = lang.strings.receive.deviceConnection.info.dialogBox;
  const { onNext, goTo, onPrevious } = useReceiveDialog();

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
    <DialogBox width={500}>
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          <LangDisplay text={connect.title} />
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={disconnectedIcon} alt="Connection Disconnected" />
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
      </DialogBoxBody>
      <DialogBoxFooter>
        <Button variant="secondary" onClick={() => goTo(2, 1)}>
          {connect.buttonName}
        </Button>
      </DialogBoxFooter>
    </DialogBox>
  );
};
