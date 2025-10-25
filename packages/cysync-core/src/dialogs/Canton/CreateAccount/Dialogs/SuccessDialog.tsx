import { ConfettiBlast, SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { useCreateCantonAccountDialog } from '../context';
import { selectLanguage, useAppSelector } from '~/store';

export const SuccessDialogComponent: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings =
    lang.strings.dialogs.cantonDialogs.createCantonAccount.dialogs;
  const { onFinishCreateAccount } = useCreateCantonAccountDialog();

  return (
    <>
      <ConfettiBlast />
      <SuccessDialog
        title={strings.success.title}
        buttonText={lang.strings.buttons.done}
        handleClick={onFinishCreateAccount}
      />
    </>
  );
};
