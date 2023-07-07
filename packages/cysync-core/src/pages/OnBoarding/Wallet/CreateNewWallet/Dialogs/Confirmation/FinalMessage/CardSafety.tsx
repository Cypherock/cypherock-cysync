import {
  GuidedFlowDialogBoxLayout,
  informationIcon,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useCreateNewWallet } from '~/context/createNewWallet';
import { selectLanguage, useAppSelector } from '~/store';

export const CardSafety: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateNewWallet();
  return (
    <GuidedFlowDialogBoxLayout
      image={informationIcon}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={
        lang.strings.onboarding.createWallet.finalMessage.cardSafety.heading
      }
      title={lang.strings.onboarding.createWallet.finalMessage.cardSafety.title}
      showInfoIcon={false}
      infoColor="yellow"
      infoText={
        lang.strings.onboarding.createWallet.finalMessage.cardSafety.note
      }
    />
  );
};
