import {
  Typography,
  DialogBox,
  DialogBoxBody,
  CardTapList,
} from '@cypherock/cysync-ui';
import React from 'react';

export const CardTap: React.FC<{ tapState: number }> = ({ tapState }) => (
  <DialogBox width={500}>
    <DialogBoxBody gap={48}>
      <Typography variant="h5" $textAlign="center">
        Tap any X1 Card below the X1 Vault to test card tapping
      </Typography>
      <CardTapList
        items={[{ text: 'X1 Card', currentState: tapState, totalState: 1 }]}
      />
    </DialogBoxBody>
  </DialogBox>
);
