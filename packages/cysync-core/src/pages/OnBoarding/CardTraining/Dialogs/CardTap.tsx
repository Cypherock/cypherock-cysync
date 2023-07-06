import {
  CardTapList,
  Container,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

export const CardTap: React.FC<{ tapState: number }> = ({ tapState }) => {
  const lang = useAppSelector(selectLanguage);

  return (
    <DialogBox width={500}>
      <DialogBoxBody gap={48}>
        <Container gap={4} direction="column">
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={lang.strings.onboarding.cardTraining.title} />
          </Typography>
          <Typography variant="h6" $textAlign="center" color="muted">
            <LangDisplay text={lang.strings.onboarding.cardTraining.subtext} />
          </Typography>
        </Container>
        <CardTapList
          items={[
            {
              text: lang.strings.x1Card,
              currentState: tapState,
              totalState: 1,
            },
          ]}
        />
      </DialogBoxBody>
    </DialogBox>
  );
};
