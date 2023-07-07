import { GuidedFlowDialogBoxLayout, successIcon } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useCreateNewWallet } from '~/context/createNewWallet';
import { selectLanguage, useAppSelector } from '~/store';

export const CardNote: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateNewWallet();
  return (
    <GuidedFlowDialogBoxLayout
      heading={
        lang.strings.onboarding.createWallet.walletCreationSuccess.heading
      }
      title={
        lang.strings.onboarding.createWallet.walletCreationSuccess.titles.third
      }
      image={successIcon}
      onNext={onNext}
      onPrevious={onPrevious}
    />
  );
};
