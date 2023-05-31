import React, { useEffect } from 'react';
import {
  DialogBoxBackground,
  DialogBoxBackgroundHeader,
  OnboardingLayout,
  joystickTrainingAsideImage,
} from '@cypherock/cysync-ui';
import { ManagerApp, TrainJoystickStatus } from '@cypherock/sdk-app-manager';
import { defaultConnector, DefaultConnectorProps } from '~/store';
import { JoystickDialog } from './Dialogs/Joystick';
import { Success } from './Dialogs/Success';
import { routes } from '../../../constants';
import {
  OnConnectCallback,
  useNavigateTo,
  useStateWithFinality,
  useWhenDeviceConnected,
} from '../../../hooks';

const BaseJoystickTraining: React.FC<DefaultConnectorProps> = ({ lang }) => {
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
    <OnboardingLayout
      img={joystickTrainingAsideImage}
      text={lang.strings.onboarding.joystickTraining.heading}
      currentState={5}
      totalState={8}
    >
      <DialogBoxBackground>
        <DialogBoxBackgroundHeader email help />
        {isFinalState || <JoystickDialog state={state} />}
        {isFinalState && <Success />}
      </DialogBoxBackground>
    </OnboardingLayout>
  );
};

export const JoystickTraining = defaultConnector(BaseJoystickTraining);
