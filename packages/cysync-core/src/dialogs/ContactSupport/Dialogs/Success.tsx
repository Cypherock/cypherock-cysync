import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { addKeyboardEvents } from '~/hooks';
import { useContactSupportDialog } from '../context';

export const ContactSupportSuccess: React.FC = () => {
  const { onClose } = useContactSupportDialog();

  const { strings } = useAppSelector(selectLanguage);
  const { buttons, dialogs } = strings;
  const { success } = dialogs.contactSupport;

  addKeyboardEvents({
    Escape: onClose,
  });

  return (
    <SuccessDialog
      title={success.formSubmit}
      buttonText={buttons.done}
      handleClick={onClose}
    />
  );
};
