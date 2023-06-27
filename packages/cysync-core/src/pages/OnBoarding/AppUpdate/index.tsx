import { LogoOutlinedAsideImage } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { OnboardingPageLayout } from '../OnboardingPageLayout';
import { AppUpdateDialogBox } from './Dialogs';

export const AppUpdate: FC = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <OnboardingPageLayout
      img={LogoOutlinedAsideImage}
      text={lang.strings.onboarding.appUpdate.heading}
      currentState={3}
      totalState={8}
      withHelp
    >
      <AppUpdateDialogBox />
    </OnboardingPageLayout>
  );
};
