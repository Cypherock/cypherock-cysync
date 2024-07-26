import { SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';
import { selectLanguage, useAppSelector } from '~/store';
import { useInheritanceExecutorMessageDialog } from '../context';

export const Success = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose } = useInheritanceExecutorMessageDialog();
  const strings = lang.strings.dialogs.inheritanceExecutorMessage;

  return <SuccessDialog title={strings.success.title} onClose={onClose} />;
};
