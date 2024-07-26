import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';
import { selectLanguage, useAppSelector } from '~/store';
import { useInheritanceExecutorMessageDialog } from '../context';

export const Success = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose } = useInheritanceExecutorMessageDialog();
  const strings = lang.strings.dialogs.inheritanceExecutorMessage.success;

  return (
    <SuccessDialog
      title={strings.title}
      buttonText={strings.button}
      onClose={onClose}
      handleClick={() => {
        onClose();
        console.log('closed dialog');
      }}
    />
  );
};
