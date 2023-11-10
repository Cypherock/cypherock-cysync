import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { addKeyboardEvents } from '~/hooks';
import { useRemovePasswordDialog } from '../context';

export const RemovePasswordSuccess: React.FC = () => {
  const { onClose } = useRemovePasswordDialog();

  const { strings } = useAppSelector(selectLanguage);
  const { buttons, dialogs } = strings;
  const { success } = dialogs.password;

  addKeyboardEvents({
    Escape: onClose,
  });

  return (
    <SuccessDialog
      title={success.remove}
      buttonText={buttons.done}
      handleClick={onClose}
    />
  );
};
