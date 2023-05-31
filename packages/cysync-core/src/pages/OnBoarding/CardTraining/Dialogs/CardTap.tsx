import {
  Typography,
  DialogBox,
  DialogBoxBody,
  CardTapList,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React from 'react';

import { DefaultConnectorProps, defaultConnector } from '~/store';

const BaseCardTap: React.FC<DefaultConnectorProps & { tapState: number }> = ({
  tapState,
  lang,
}) => (
  <DialogBox width={500}>
    <DialogBoxBody gap={48}>
      <Typography variant="h5" $textAlign="center">
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

export const CardTap = defaultConnector(BaseCardTap);
