import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useRemovePasswordDialog } from '../context';

export const RemovePasswordSuccess: React.FC = () => {
  const { onClose } = useRemovePasswordDialog();

  const { strings } = useAppSelector(selectLanguage);
  const { buttons, dialogs } = strings;
  const { success } = dialogs.password;

  return (
    <SuccessDialog
      title={success.remove}
      buttonText={buttons.done}
      handleClick={onClose}
      onClose={onClose}
    />
  );
};
