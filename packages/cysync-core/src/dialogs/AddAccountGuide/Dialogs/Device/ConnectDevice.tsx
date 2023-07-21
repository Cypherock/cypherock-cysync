import {
  LangDisplay,
  disconnectedIcon,
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  Typography,
  Image,
  Container,
} from '@cypherock/cysync-ui';
import React from 'react';
import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { useAddAccountGuide } from '../../context';

export const ConnectDevice: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const connect =
    lang.strings.addAccount.addAccount.connectDevice.info.dialogBox;
  const { onNext, onPrevious } = useAddAccountGuide();

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
        <Image src={disconnectedIcon} alt="Device disconnected" />
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={connect.header} />
          </Typography>
        </Container>
      </DialogBoxBody>
    </DialogBox>
  );
};
