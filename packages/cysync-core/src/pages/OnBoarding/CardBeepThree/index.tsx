import { LogoOutlinedAsideImage } from '@cypherock/cysync-ui';
import React from 'react';

import { CardList } from './Dialogs/CardList';

import { selectLanguage, useAppSelector } from '../../../store';
import { OnboardingPageLayout } from '../OnboardingPageLayout';

export const CardBeepThree: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <OnboardingPageLayout
      img={LogoOutlinedAsideImage}
      text={lang.strings.onboarding.cardBeep3Wallet.heading}
      currentState={3}
      totalState={8}
      withHelp
    >
      <CardList />
    </OnboardingPageLayout>
  );
};
