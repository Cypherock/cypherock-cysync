import {
  Container,
  DialogBox,
  DialogBoxBody,
  Image,
  loaderIcon,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

export const AppUpdateChecking = () => (
  <DialogBox width={500}>
    <DialogBoxBody>
      <Container display="flex" direction="column" gap={34}>
        <Image src={loaderIcon} alt="loader" animate="spin" $animDuration={3} />
        <Typography variant="h5" $textAlign="center">
          Please wait while we check for Cypherock CySync updates
        </Typography>
      </Container>
    </DialogBoxBody>
  </DialogBox>
);
