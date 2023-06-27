import React from 'react';
import { joystickTrainingAsideImage } from '@cypherock/cysync-ui';

import { useAppSelector, selectLanguage } from '~/store';
import { WithConnectedDevice } from '~/components';

import { OnboardingPageLayout } from '../OnboardingPageLayout';
import { JoystickTrainingDialog } from './Dialogs';

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
      <WithConnectedDevice onInitial>
        <JoystickTrainingDialog />
      </WithConnectedDevice>
    </OnboardingPageLayout>
  );
};
