import { LogoOutlinedAside, SuccessDialog } from '@cypherock/cysync-ui';
import React, { useEffect } from 'react';

import { routes } from '~/constants';
import { analyticsService, ANALYTICS_EVENTS } from '~/services/analytics';

import { PasswordForm } from './Dialogs/PasswordForm';

import { selectLanguage, useAppSelector } from '../../../store';
import { OnboardingPageLayout } from '../OnboardingPageLayout';

export const SetPassword: React.FC = () => {
  const [isPasswordSet, setIsPasswordSet] = React.useState(false);
  const lang = useAppSelector(selectLanguage);

  useEffect(() => {
    analyticsService.trackEvent(
      ANALYTICS_EVENTS.ONBOARDING_PASSWORD_PAGE_VIEWED,
    );
  }, []);

  useEffect(() => {
    if (isPasswordSet) {
      analyticsService.trackEvent(ANALYTICS_EVENTS.ONBOARDING_PASSWORD_SET);
    }
  }, [isPasswordSet]);

  return (
    <OnboardingPageLayout
      img={LogoOutlinedAside}
      text={lang.strings.onboarding.setPassword.heading}
      currentState={2}
      totalState={8}
      withHelp
      backTo={isPasswordSet ? undefined : routes.onboarding.terms.path}
    >
      {isPasswordSet || <PasswordForm passwordSetter={setIsPasswordSet} />}
      {isPasswordSet && (
        <SuccessDialog title={lang.strings.onboarding.setPassword.success} />
      )}
    </OnboardingPageLayout>
  );
};
