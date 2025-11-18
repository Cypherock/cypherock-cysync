import { ConfettiBlast, SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { useEnableMergeDelegationDialog } from '../context';
import { selectLanguage, useAppSelector } from '~/store';

export const SuccessDialogComponent: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings =
    lang.strings.dialogs.cantonDialogs.enableMergeDelegation.dialogs;
  const { onFinishEnableMergeDelegation } = useEnableMergeDelegationDialog();

  return (
    <>
      <ConfettiBlast />
      <SuccessDialog
        title={strings.confirmation.title}
        buttonText={lang.strings.buttons.done}
        handleClick={onFinishEnableMergeDelegation}
      />
    </>
  );
};
