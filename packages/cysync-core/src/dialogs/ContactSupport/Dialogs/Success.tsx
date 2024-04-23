import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useContactSupportDialog } from '../context';

export const ContactSupportSuccess: React.FC = () => {
  const { onClose } = useContactSupportDialog();

  const { strings } = useAppSelector(selectLanguage);
  const { buttons, dialogs } = strings;
  const { success } = dialogs.contactSupport;

  return (
    <SuccessDialog
      title={success.formSubmit}
      buttonText={buttons.done}
      handleClick={onClose}
      onClose={onClose}
    />
  );
};
