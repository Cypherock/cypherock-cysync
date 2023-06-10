import React from 'react';
import { LogoOutlinedAsideImage } from '@cypherock/cysync-ui';

import { PasswordForm } from './Dialogs/PasswordForm';
import { selectLanguage, useAppSelector } from '../../../store';
import { OnboardingPageLayout } from '../OnboardingPageLayout';
import { Success } from './Dialogs/Success';

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
      withBack
    >
      {isPasswordSet || <PasswordForm passwordSetter={setIsPasswordSet} />}
      {isPasswordSet && <Success />}
    </OnboardingPageLayout>
  );
};
