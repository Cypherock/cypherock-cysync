import { LogoOutlinedAsideImage, SuccessDialog } from '@cypherock/cysync-ui';
import React from 'react';

import { routes } from '~/constants';

import { PasswordForm } from './Dialogs/PasswordForm';

import { selectLanguage, useAppSelector } from '../../../store';
import { OnboardingPageLayout } from '../OnboardingPageLayout';

export const SetPassword: React.FC = () => {
  const [isPasswordSet, setIsPasswordSet] = React.useState(false);
  const lang = useAppSelector(selectLanguage);

  return (
    <OnboardingPageLayout
      img={LogoOutlinedAsideImage}
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
