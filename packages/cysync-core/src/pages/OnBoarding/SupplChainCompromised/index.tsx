import { LogoOutlinedAsideImage } from '@cypherock/cysync-ui';
import React from 'react';

import { SupplyChainCompromise } from './Dialogs/SupplyChainCompromise';

import { selectLanguage, useAppSelector } from '../../../store';
import { OnboardingPageLayout } from '../OnboardingPageLayout';

export const SupplyChainCompromised: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <OnboardingPageLayout
      img={LogoOutlinedAsideImage}
      text={lang.strings.onboarding.walletList.heading}
      currentState={3}
      totalState={8}
      withHelp
    >
      <SupplyChainCompromise />
    </OnboardingPageLayout>
  );
};
