import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { addKeyboardEvents } from '~/hooks';
import { useAuthenticateX1CardDialog } from '../context';

export const AuthenticateX1CardSuccess: React.FC = () => {
  const { onClose } = useAuthenticateX1CardDialog();

  const { strings } = useAppSelector(selectLanguage);
  const { buttons, dialogs } = strings;
  const { success } = dialogs.auth.authX1Card;

  addKeyboardEvents({
    Escape: onClose,
  });

  return (
    <SuccessDialog
      title={success}
      buttonText={buttons.done}
      handleClick={onClose}
    />
  );
};
