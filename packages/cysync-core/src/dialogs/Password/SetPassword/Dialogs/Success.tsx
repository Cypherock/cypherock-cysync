import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useSetPasswordDialog } from '../context';

export const SetPasswordSuccess: React.FC = () => {
  const { onClose } = useSetPasswordDialog();

  const { strings } = useAppSelector(selectLanguage);
  const { buttons, dialogs } = strings;
  const { success } = dialogs.password;

  return (
    <SuccessDialog
      title={success.set}
      buttonText={buttons.done}
      handleClick={onClose}
      onClose={onClose}
    />
  );
};
