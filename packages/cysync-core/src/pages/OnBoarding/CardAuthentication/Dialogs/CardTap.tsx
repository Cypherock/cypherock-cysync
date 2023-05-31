import {
  Typography,
  DialogBox,
  DialogBoxBody,
  CardTapList,
  Container,
  Button,
} from '@cypherock/cysync-ui';
import React from 'react';

export const CardTap: React.FC<{ tapState: number }> = ({ tapState }) => (
  <DialogBox width={500}>
    <DialogBoxBody gap={48}>
      <Container display="flex" direction="column" gap={4}>
        <Typography variant="h5" $textAlign="center">
          Tap X1 Cards one by one below the <br />
          X1 Vault (
          <Button variant="none" color="golden">
            <Typography variant="h5" color="gold">
              ?
            </Typography>
          </Button>
          )
        </Typography>
        <Typography variant="h6" $textAlign="center" color="muted">
          Do not lift until you hear 3 beep sounds
        </Typography>
      </Container>
      <CardTapList
        items={[
          { text: 'X1 Card #1', currentState: tapState, totalState: 3 },
          { text: 'X1 Card #2', currentState: tapState - 3, totalState: 3 },
          {
            text: 'X1 Card #3',
            currentState: tapState - 3 * 2,
            totalState: 3,
          },
          {
            text: 'X1 Card #4',
            currentState: tapState - 3 * 3,
            totalState: 3,
          },
        ]}
      />
    </DialogBoxBody>
  </DialogBox>
);
