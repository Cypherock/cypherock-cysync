import {
  Typography,
  DialogBox,
  DialogBoxBody,
  CardTapList,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

export const CardTap: React.FC<{ tapState: number }> = ({ tapState }) => {
  const lang = useAppSelector(selectLanguage);

  return (
    <DialogBox width={500}>
      <DialogBoxBody gap={48}>
        <Typography variant="h6" $textAlign="center">
          <LangDisplay text={lang.strings.onboarding.cardTraining.title} />
        </Typography>
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
