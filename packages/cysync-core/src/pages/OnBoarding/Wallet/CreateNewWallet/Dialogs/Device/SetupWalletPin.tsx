import { setupPin, GuidedFlowDialogBoxLayout } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useCreateNewWallet } from '~/context/createNewWallet';
import { selectLanguage, useAppSelector } from '~/store';

export const SetupWalletPin: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateNewWallet();
  return (
    <GuidedFlowDialogBoxLayout
      image={setupPin}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.onboarding.createWallet.enterPin.heading}
      title={lang.strings.onboarding.createWallet.enterPin.title}
      subTitle={lang.strings.onboarding.createWallet.enterPin.subTitle}
      bulletList={lang.strings.onboarding.createWallet.enterPin.list}
      infoText={lang.strings.onboarding.createWallet.enterPin.note}
      infoColor="yellow"
    />
  );
};
