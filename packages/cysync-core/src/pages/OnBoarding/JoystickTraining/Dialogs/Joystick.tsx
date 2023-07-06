import {
  Container,
  DialogBox,
  DialogBoxBody,
  JoystickInteraction,
  JoystickInteractionProps,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

import { LanguageStrings } from '~/constants';
import { selectLanguage, useAppSelector } from '~/store';

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
      title: training.leftTitle,
      states: {
        up: 'completed',
        right: 'completed',
        down: 'completed',
        left: 'completed',
      },
      bottomText: training.subtext,
    },
    {
      title: training.centerTitle,
      states: { center: 'selected' },
      bottomText: training.centerSubtext,
    },
    {
      title: training.centerTitle,
      states: { center: 'completed' },
      bottomText: training.centerSubtext,
    },
  ];

  return stepContentMap[state];
};

export const JoystickTrainingInteraction: React.FC<{ state: number }> = ({
  state,
}) => {
  const lang = useAppSelector(selectLanguage);

  const content = React.useMemo<StepContent>(
    () => getStepContent(state, lang.strings),
    [state, lang],
  );

  if (!content) return null;

  const { title, states, bottomText } = content;

  return (
    <DialogBox width={500}>
      <DialogBoxBody gap={0}>
        <Typography
          variant="h4"
          $textAlign="center"
          $fontWeight="medium"
          mb={7}
        >
          <LangDisplay text={title} />
        </Typography>
        <JoystickInteraction {...states} />
        <Container display="flex" direction="column" gap={8}>
          <Typography variant="h5" $letterSpacing={0.0625} $textAlign="center">
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
