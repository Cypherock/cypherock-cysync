import {
  Typography,
  DialogBox,
  DialogBoxBody,
  Container,
  JoystickInteractionProps,
  JoystickInteraction,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React from 'react';

import { LanguageStrings } from '~/constants';
import { DefaultConnectorProps, defaultConnector } from '~/store';

interface StepContent {
  title: string;
  states: JoystickInteractionProps;
  bottomText: string;
}

const getStepContent = (state: number, lang: LanguageStrings): StepContent => {
  const training = lang.onboarding.joystickTraining;

  const stepContentMap: StepContent[] = [
    {
      title: training.upTitle,
      states: { up: 'selected' },
      bottomText: training.subtext,
    },
    {
      title: training.rightTitle,
      states: { up: 'completed', right: 'selected' },
      bottomText: training.subtext,
    },
    {
      title: training.downTitle,
      states: { up: 'completed', right: 'completed', down: 'selected' },
      bottomText: training.subtext,
    },
    {
      title: training.leftTitle,
      states: {
        up: 'completed',
        right: 'completed',
        down: 'completed',
        left: 'selected',
      },
      bottomText: training.subtext,
    },
    {
      title: training.centerTitle,
      states: { center: 'selected' },
      bottomText: training.centerSubtext,
    },
  ];

  return stepContentMap[state];
};

const BaseJoystickDialog: React.FC<
  DefaultConnectorProps & { state: number }
> = ({ state, lang }) => {
  const content = React.useMemo<StepContent>(
    () => getStepContent(state, lang.strings),
    [state, lang],
  );

  if (!content) return null;

  const { title, states, bottomText } = content;

  return (
    <DialogBox width={500}>
      <DialogBoxBody gap={0}>
        <Typography variant="h4" $textAlign="center" font="medium" mb={7}>
          <LangDisplay text={title} />
        </Typography>
        <JoystickInteraction {...states} />
        <Container display="flex" direction="column" gap={8}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={bottomText} />
          </Typography>
          <Typography variant="h6" $textAlign="center" color="muted">
            {lang.strings.onboarding.joystickTraining.footer}
          </Typography>
        </Container>
      </DialogBoxBody>
    </DialogBox>
  );
};

export const JoystickDialog = defaultConnector(BaseJoystickDialog);
