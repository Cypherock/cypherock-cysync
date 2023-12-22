import { joystickTrainingAsideImage } from '@cypherock/cysync-ui';
import React from 'react';

import { WithConnectedDevice } from '~/components';
import { useAppSelector, selectLanguage } from '~/store';

import { JoystickTrainingDialog } from './Dialogs';

import { OnboardingPageLayout } from '../OnboardingPageLayout';

export const JoystickTraining: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <OnboardingPageLayout
      img={joystickTrainingAsideImage}
      text={lang.strings.onboarding.joystickTraining.heading}
      currentState={5}
      totalState={8}
      withEmail
      withHelp
    >
      <WithConnectedDevice onInitial showAnimation={false}>
        <JoystickTrainingDialog />
      </WithConnectedDevice>
    </OnboardingPageLayout>
  );
};
