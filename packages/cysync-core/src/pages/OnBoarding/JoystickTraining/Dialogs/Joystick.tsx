import {
  Typography,
  DialogBox,
  DialogBoxBody,
  Container,
  JoystickInteractionProps,
  JoystickInteraction,
} from '@cypherock/cysync-ui';
import React, { ReactNode } from 'react';

const bottomText = (
  <Typography variant="h5" $textAlign="center">
    X1 Vault provides 4 way joystick for
    <br />
    screen navigation
  </Typography>
);
const steps: {
  title: string;
  states: JoystickInteractionProps;
  bottomText: ReactNode;
}[] = [
  { title: 'Toggle Up', states: { up: 'selected' }, bottomText },
  {
    title: 'Toggle Right',
    states: { up: 'completed', right: 'selected' },
    bottomText,
  },
  {
    title: 'Toggle Down',
    states: { up: 'completed', right: 'completed', down: 'selected' },
    bottomText,
  },
  {
    title: 'Toggle Left',
    states: {
      up: 'completed',
      right: 'completed',
      down: 'completed',
      left: 'selected',
    },
    bottomText,
  },
  {
    title: 'Center click the joystick to proceed',
    states: { center: 'selected' },
    bottomText: (
      <Typography variant="h5" $textAlign="center">
        X1 Vault has a center button to
        <br />
        perform click
      </Typography>
    ),
  },
];

export const JoystickDialog: React.FC<{ state: number }> = props => {
  const { state } = props;
  const title = steps[state].title ?? 'Center click joystick to\nproceed';
  const states = steps[state].states ?? {};
  const subTitle = steps[state].bottomText ?? '';
  return (
    <DialogBox width={500}>
      <DialogBoxBody gap={0}>
        <Typography variant="h4" $textAlign="center" font="medium" mb={7}>
          {title}
        </Typography>
        <JoystickInteraction {...states} />
        <Container display="flex" direction="column" gap={8}>
          {subTitle}
          <Typography variant="h6" $textAlign="center" color="muted">
            Follow the instruction on the device
          </Typography>
        </Container>
      </DialogBoxBody>
    </DialogBox>
  );
};
