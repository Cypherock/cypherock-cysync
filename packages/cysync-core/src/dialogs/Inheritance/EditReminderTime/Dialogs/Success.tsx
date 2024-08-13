import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEditReminderTimeDialog } from '../context';

export const Success = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose } = useInheritanceEditReminderTimeDialog();
  const strings = lang.strings.dialogs.inheritanceEditReminderTime.success;

  return (
    <SuccessDialog
      title={strings.title}
      buttonText={lang.strings.buttons.done}
      onClose={onClose}
      width={560}
      handleClick={onClose}
      headerType="h5"
      bodyBottomPadding={4}
      showCloseBtn
    />
  );
};
