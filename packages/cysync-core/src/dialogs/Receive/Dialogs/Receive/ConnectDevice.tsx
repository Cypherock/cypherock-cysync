import {
  LangDisplay,
  disconnectedIcon,
  DialogBox,
  DialogBoxBody,
  Typography,
  Image,
  Container,
} from '@cypherock/cysync-ui';
import React from 'react';

import { useReceiveDialog } from '~/dialogs/Receive/context';
import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

export const ConnectDevice: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const connect =
    lang.strings.addAccount.addAccount.connectDevice.info.dialogBox;
  const { onNext, onPrevious } = useReceiveDialog();

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
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={disconnectedIcon} alt="Verify Coin" />
        <Container display="flex" direction="column" gap={20} width="full">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={connect.header} />
          </Typography>
        </Container>
      </DialogBoxBody>
    </DialogBox>
  );
};
