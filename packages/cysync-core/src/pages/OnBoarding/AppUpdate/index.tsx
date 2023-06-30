import { LogoOutlinedAsideImage } from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { WithConnectedDevice } from '~/components';
import { selectLanguage, useAppSelector } from '~/store';

import { AppUpdateDialogBox } from './Dialogs';

import { OnboardingPageLayout } from '../OnboardingPageLayout';

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
      <WithConnectedDevice>
        <AppUpdateDialogBox />
      </WithConnectedDevice>
    </OnboardingPageLayout>
  );
};
