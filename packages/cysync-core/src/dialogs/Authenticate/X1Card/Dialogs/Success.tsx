import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useAuthenticateX1CardDialog } from '../context';

export const AuthenticateX1CardSuccess: React.FC = () => {
  const { onClose } = useAuthenticateX1CardDialog();

  const { strings } = useAppSelector(selectLanguage);
  const { buttons, dialogs } = strings;
  const { success } = dialogs.auth.authX1Card;

  return (
    <SuccessDialog
      title={success}
      buttonText={buttons.done}
      handleClick={onClose}
      onClose={onClose}
    />
  );
};
