import { GuidedFlowDialogBox, pinDeviceConsent } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useCreateNewWallet } from '~/context/createNewWallet';
import { selectLanguage, useAppSelector } from '~/store';

export const WalletPinConsent: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateNewWallet();
  return (
    <GuidedFlowDialogBox
      image={pinDeviceConsent}
      onNext={onNext}
      onPrevious={onPrevious}
      heading={lang.strings.onboarding.createWallet.setupPinConsent.heading}
      title={lang.strings.onboarding.createWallet.setupPinConsent.title}
      subTitle={lang.strings.onboarding.createWallet.setupPinConsent.subTitle}
    />
  );
};
