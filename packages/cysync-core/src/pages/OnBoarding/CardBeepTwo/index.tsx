import { LogoOutlinedAsideImage } from '@cypherock/cysync-ui';
import React from 'react';

import { CardList } from './Dialogs/CardList';

import { selectLanguage, useAppSelector } from '../../../store';
import { OnboardingPageLayout } from '../OnboardingPageLayout';

export const CardBeepTwo: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <OnboardingPageLayout
      img={LogoOutlinedAsideImage}
      text={lang.strings.onboarding.walletList.heading}
      currentState={3}
      totalState={8}
      withHelp
    >
      <CardList />
    </OnboardingPageLayout>
  );
};
