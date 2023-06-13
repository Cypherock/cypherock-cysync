import { LogoOutlinedAsideImage } from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';
import React, { FC } from 'react';
import { WithConnectedDevice } from '~/components';
import { OnboardingPageLayout } from '../OnboardingPageLayout';
import { AppUpdateDialogBox } from './Dialogs';

export const AppUpdate: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const [back, setBack] = React.useState(true);

  return (
    <OnboardingPageLayout
      img={LogoOutlinedAsideImage}
      text={lang.strings.onboarding.appUpdate.heading}
      currentState={3}
      totalState={8}
      withHelp
      withBack={back}
    >
      <WithConnectedDevice>
        <AppUpdateDialogBox setBack={setBack} />
      </WithConnectedDevice>
    </OnboardingPageLayout>
  );
};
