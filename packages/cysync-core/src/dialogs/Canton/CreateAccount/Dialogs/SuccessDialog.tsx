import { ConfettiBlast, SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useCreateCantonAccountDialog } from '../context';

export const SuccessDialogComponent: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings =
    lang.strings.dialogs.cantonDialogs.createCantonAccount.dialogs;
  const { onNext } = useCreateCantonAccountDialog();

  return (
    <>
      <ConfettiBlast />
      <SuccessDialog
        title={strings.success.title}
        buttonText={lang.strings.buttons.continue}
        handleClick={onNext}
      />
    </>
  );
};
