import { disconnectedIcon, IconDialogBox, Image } from '@cypherock/cysync-ui';
import React, { FC } from 'react';
import { selectLanguage, useAppSelector } from '~/store';
import { useSendDialog } from '../../context';
import { addKeyboardEvents } from '~/hooks';

export const ConnectDevice: FC = () => {
  const { onNext, onPrevious } = useSendDialog();
  const lang = useAppSelector(selectLanguage);
  const confirm = lang.strings.send.deviceConnection.info.dialogBox;
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
    <IconDialogBox
      icon={<Image src={disconnectedIcon} alt="Disconnected icon" />}
      title={confirm.header}
    />
  );
};
