import { LogoOutlinedAsideImage } from '@cypherock/cysync-ui';
import React from 'react';

import { EmailForm } from './Dialogs/EmailForm';

import { selectLanguage, useAppSelector } from '../../../store';
import { OnboardingPageLayout } from '../OnboardingPageLayout';

export const EmailAuth: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <OnboardingPageLayout
      img={LogoOutlinedAsideImage}
      text={lang.strings.onboarding.emailAuth.heading}
      currentState={3}
      totalState={8}
      withHelp
    >
      <EmailForm />
    </OnboardingPageLayout>
  );
};
