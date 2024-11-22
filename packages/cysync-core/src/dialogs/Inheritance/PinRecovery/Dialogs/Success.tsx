import { ConfettiBlast, SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useInheritancePinRecoveryDialog } from '../context';

export const SuccessPinRecovery = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose } = useInheritancePinRecoveryDialog();

  const strings = lang.strings.dialogs.inheritancePinRecovery.success;

  return (
    <>
      <ConfettiBlast />
      <SuccessDialog
        width={800}
        title={strings.title}
        buttonText={lang.strings.buttons.done}
        handleClick={onClose}
      />
    </>
  );
};
