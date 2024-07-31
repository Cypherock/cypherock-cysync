import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEditExecutorMessageDialog } from '../context';

export const Success = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose } = useInheritanceEditExecutorMessageDialog();
  const { strings } = lang;

  return (
    <SuccessDialog
      title={strings.dialogs.inheritanceEditExecutorMessage.success.title}
      buttonText={strings.buttons.done}
      onClose={onClose}
      handleClick={onClose}
      width={560}
      headerType="h5"
      bodyBottomPadding={4}
      showCloseBtn
    />
  );
};
