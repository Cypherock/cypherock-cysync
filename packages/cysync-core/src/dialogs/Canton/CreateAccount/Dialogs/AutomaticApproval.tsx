import React from 'react';

import { useCreateCantonAccountDialog } from '../context';
import { selectLanguage, useAppSelector } from '~/store';
import { EnableApprovalPrompt } from '~/components';

export const AutomaticApprovalDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onFinishCreateAccount } = useCreateCantonAccountDialog();

  return (
    <EnableApprovalPrompt
      primaryActionText={lang.strings.buttons.continue}
      primaryActionOnClick={onFinishCreateAccount}
    />
  );
};
