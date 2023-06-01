import {
  Typography,
  DialogBox,
  DialogBoxBody,
  CardTapList,
  Container,
  Button,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

export const CardTap: React.FC<{ tapState: number }> = ({ tapState }) => {
  const lang = useAppSelector(selectLanguage);
  return (
    <DialogBox width={500}>
      <DialogBoxBody gap={48}>
        <Container display="flex" direction="column" gap={4}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={lang.strings.onboarding.cardAuth.title} /> (
            <Button variant="none" color="golden">
              <Typography variant="h5" color="gold">
                ?
              </Typography>
            </Button>
            )
          </Typography>
          <Typography variant="h6" $textAlign="center" color="muted">
            <LangDisplay text={lang.strings.onboarding.cardAuth.subtext} />
          </Typography>
        </Container>
        <CardTapList
          items={[
            {
              text: `${lang.strings.x1Card} #1`,
              currentState: tapState,
              totalState: 3,
            },
            {
              text: `${lang.strings.x1Card} #2`,
              currentState: tapState - 3,
              totalState: 3,
            },
            {
              text: `${lang.strings.x1Card} #3`,
              currentState: tapState - 3 * 2,
              totalState: 3,
            },
            {
              text: `${lang.strings.x1Card} #4`,
              currentState: tapState - 3 * 3,
              totalState: 3,
            },
          ]}
        />
      </DialogBoxBody>
    </DialogBox>
  );
};
