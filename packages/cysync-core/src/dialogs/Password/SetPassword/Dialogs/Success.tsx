import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { addKeyboardEvents } from '~/hooks';
import { useSetPasswordDialog } from '../context';

export const SetPasswordSuccess: React.FC = () => {
  const { onClose } = useSetPasswordDialog();

  const { strings } = useAppSelector(selectLanguage);
  const { buttons, dialogs } = strings;
  const { success } = dialogs.password;

  addKeyboardEvents({
    Escape: onClose,
  });

  return (
    <SuccessDialog
      title={success.set}
      buttonText={buttons.done}
      handleClick={onClose}
    />
  );
};
