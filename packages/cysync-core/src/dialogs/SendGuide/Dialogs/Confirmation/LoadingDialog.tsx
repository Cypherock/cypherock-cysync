import {
  LangDisplay,
  loaderGrayIcon,
  DialogBox,
  DialogBoxBody,
  Typography,
  Image,
} from '@cypherock/cysync-ui';
import React from 'react';
import { useSendGuide } from '../../context';
import { addKeyboardEvents } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

export const LoadingDialog: React.FC = () => {
  const { onNext, onPrevious } = useSendGuide();
  const lang = useAppSelector(selectLanguage);

  const loading = lang.strings.send.loading.info.dialogBox;

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
        <Image src={loaderGrayIcon} alt="Loader" animate="spin" />
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={loading.text} />
        </Typography>
      </DialogBoxBody>
    </DialogBox>
  );
};
