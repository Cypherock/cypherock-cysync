import { ConfettiBlast, SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { useEnableApprovalDialog } from '../context';
import { selectLanguage, useAppSelector } from '~/store';

export const SuccessDialogComponent: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.dialogs.cantonDialogs.enableApproval.dialogs;
  const { onFinishEnableApproval } = useEnableApprovalDialog();

  return (
    <>
      <ConfettiBlast />
      <SuccessDialog
        title={strings.confirmation.title}
        buttonText={lang.strings.buttons.done}
        handleClick={onFinishEnableApproval}
      />
    </>
  );
};
