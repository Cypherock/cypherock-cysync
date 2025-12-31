import {
  Image,
  SuccessDialog as SuccessDialogComponent,
  successIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useCantonLoginDialog } from '../context';

export const SuccessDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose } = useCantonLoginDialog();

  return (
    <SuccessDialogComponent
      icon={<Image src={successIcon} alt="Success icon" />}
      title={lang.strings.dialogs.cantonDialogs.login.success.title}
      buttonText={lang.strings.buttons.done}
      handleClick={onClose}
      width={800}
    />
  );
};
