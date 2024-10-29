import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEditEncryptedMessageDialog } from '../context';

export const Success = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose } = useInheritanceEditEncryptedMessageDialog();
  const strings = lang.strings.dialogs.inheritanceEditEncryptedMessage.success;

  return (
    <SuccessDialog
      title={strings.title}
      buttonText={lang.strings.buttons.done}
      onClose={onClose}
      handleClick={onClose}
      width={560}
      headerType="h5"
      bodyBottomPadding={4}
      showCloseBtn
    />
  );
};
