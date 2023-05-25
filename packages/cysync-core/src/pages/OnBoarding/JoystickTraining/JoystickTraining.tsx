import React, { ReactElement } from 'react';
import {
  DialogBoxBackground,
  DialogBoxBackgroundHeader,
  OnboardingLayout,
  joystickIcon,
} from '@cypherock/cysync-ui';
import { JoystickDialog } from './Dialogs/Joystick';
import { Success } from './Dialogs/Success';

export const JoystickTraining = (): ReactElement => {
  const [state, setState] = React.useState(0);
  return (
    <OnboardingLayout
      img={joystickIcon}
      text="Joystick Checkup"
      currentState={5}
      totalState={8}
    >
      <DialogBoxBackground>
        <DialogBoxBackgroundHeader email help />
        {state < 5 && <JoystickDialog state={state} />}
        {state === 5 && <Success />}
      </DialogBoxBackground>
      <button type="button" onClick={() => setState((state + 1) % 6)}>
        {' '}
      </button>
    </OnboardingLayout>
  );
};
