import {
  LangDisplay,
  loaderGrayIcon,
  DialogBox,
  DialogBoxHeader,
  DialogBoxBody,
  Typography,
  Image,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useSendGuide } from '../context';
import { addKeyboardEvents } from '~/hooks';

export const LoadingDialog: React.FC = () => {
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

  return (
    <DialogBox width={500}>
      <DialogBoxHeader height={56} width={500}>
        <Typography variant="fineprint" width="100%" color="muted">
          <LangDisplay text="Send crypto" />
        </Typography>
      </DialogBoxHeader>
      <DialogBoxBody pt={4} pr={5} pb={4} pl={5}>
        <Image src={loaderGrayIcon} alt="Loader" animate="spin" />
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text="Broadcasting the transaction" />
        </Typography>
      </DialogBoxBody>
    </DialogBox>
  );
};
