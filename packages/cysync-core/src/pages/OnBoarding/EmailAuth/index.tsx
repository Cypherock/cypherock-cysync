import { LogoOutlinedAsideImage } from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { analyticsService, ANALYTICS_EVENTS } from '~/services/analytics';

import { EmailForm } from './Dialogs/EmailForm';

import { selectLanguage, useAppSelector } from '../../../store';
import { OnboardingPageLayout } from '../OnboardingPageLayout';

export const EmailAuth: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  useEffect(() => {
    analyticsService.trackEvent(ANALYTICS_EVENTS.ONBOARDING_EMAIL_PAGE_VIEWED);
  }, []);

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
