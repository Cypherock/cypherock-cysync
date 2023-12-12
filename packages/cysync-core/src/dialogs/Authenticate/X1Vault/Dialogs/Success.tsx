import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useAuthenticateX1VaultDialog } from '../context';

export const AuthenticateX1VaultSuccess: React.FC = () => {
  const { onClose } = useAuthenticateX1VaultDialog();

  const { strings } = useAppSelector(selectLanguage);
  const { buttons, dialogs } = strings;
  const { success } = dialogs.auth.authX1Vault;

  return (
    <SuccessDialog
      title={success}
      buttonText={buttons.done}
      handleClick={onClose}
      onClose={onClose}
    />
  );
};
