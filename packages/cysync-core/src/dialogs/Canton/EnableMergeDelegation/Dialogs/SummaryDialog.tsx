import React from 'react';

import { EnableMergeDelegationPrompt } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useEnableMergeDelegationDialog } from '../context';

export const SummaryDialog: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose, onNext, isOnboarding } = useEnableMergeDelegationDialog();

  return (
    <EnableMergeDelegationPrompt
      primaryActionText={lang.strings.buttons.continue}
      primaryActionOnClick={onNext}
      secondaryActionText={isOnboarding ? lang.strings.buttons.skip : undefined}
      secondaryActionOnClick={isOnboarding ? onClose : undefined}
    />
  );
};
