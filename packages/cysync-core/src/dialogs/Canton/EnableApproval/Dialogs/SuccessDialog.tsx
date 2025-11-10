import { ConfettiBlast, SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { useEnableApprovalDialog } from '../context';

export const SuccessDialogComponent: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.dialogs.cantonDialogs.enableApproval.dialogs;
  const { onFinishEnableApproval, isOnboarding } = useEnableApprovalDialog();

  return (
    <>
      {!isOnboarding && <ConfettiBlast />}
      <SuccessDialog
        title={strings.confirmation.title}
        buttonText={
          isOnboarding
            ? lang.strings.buttons.continue
            : lang.strings.buttons.done
        }
        handleClick={onFinishEnableApproval}
      />
    </>
  );
};
