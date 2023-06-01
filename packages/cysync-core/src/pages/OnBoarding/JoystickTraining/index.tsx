import React, { useEffect } from 'react';
import { joystickTrainingAsideImage } from '@cypherock/cysync-ui';
import { ManagerApp, TrainJoystickStatus } from '@cypherock/sdk-app-manager';

import { routes } from '~/constants';
import {
  OnConnectCallback,
  useNavigateTo,
  useStateWithFinality,
  useWhenDeviceConnected,
} from '~/hooks';
import { useAppSelector, selectLanguage } from '~/store';
import { Success } from './Dialogs/Success';
import { JoystickDialog } from './Dialogs/Joystick';
import { OnboardingPageLayout } from '../OnboardingPageLayout';

export const JoystickTraining: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  const [state, setState, isFinalState] = useStateWithFinality(
    TrainJoystickStatus.TRAIN_JOYSTICK_INIT,
    TrainJoystickStatus.TRAIN_JOYSTICK_CENTER,
  );
  const navigateTo = useNavigateTo();

  const trainJoystick: OnConnectCallback = async ({
    connection,
    connectDevice,
  }) => {
    if (!connection) return;

    const app = await ManagerApp.create(await connectDevice(connection.device));
    await app.trainJoystick(s => {
      if (s < TrainJoystickStatus.TRAIN_JOYSTICK_CENTER) setState(s);
    });
    setState(TrainJoystickStatus.TRAIN_JOYSTICK_CENTER);
    await app.destroy();
  };

  useWhenDeviceConnected(trainJoystick);

  useEffect(() => {
    if (isFinalState) navigateTo(routes.onboarding.cardTraining.path, 3000);
  }, [isFinalState]);

  return (
    <OnboardingPageLayout
      img={joystickTrainingAsideImage}
      text={lang.strings.onboarding.joystickTraining.heading}
      currentState={5}
      totalState={8}
      withEmail
      withHelp
    >
      {isFinalState || <JoystickDialog state={state} />}
      {isFinalState && <Success />}
    </OnboardingPageLayout>
  );
};
