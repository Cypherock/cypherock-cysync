import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { addKeyboardEvents } from '~/hooks';
import { useChangePasswordDialog } from '../context';

export const ChangePasswordSuccess: React.FC = () => {
  const { onClose } = useChangePasswordDialog();

  const { strings } = useAppSelector(selectLanguage);
  const { buttons, dialogs } = strings;
  const { success } = dialogs.password;

  addKeyboardEvents({
    Escape: onClose,
  });

  return (
    <SuccessDialog
      title={success.change}
      buttonText={buttons.done}
      handleClick={onClose}
    />
  );
};
