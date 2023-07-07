import { confirmPin, GuidedFlowDialogBoxLayout } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useCreateNewWallet } from '~/context/createNewWallet';
import { selectLanguage, useAppSelector } from '~/store';

export const ConfirmPin: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateNewWallet();
  return (
    <GuidedFlowDialogBoxLayout
      image={confirmPin}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.onboarding.createWallet.confirmPin.heading}
      isLoading
      loadingText={lang.strings.onboarding.createWallet.confirmPin.loading}
      title={lang.strings.onboarding.createWallet.confirmPin.title}
      bulletList={lang.strings.onboarding.createWallet.confirmPin.list}
    />
  );
};
