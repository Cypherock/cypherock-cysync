import React from 'react';
import {
  Container,
  DialogBox,
  DialogBoxBody,
  LoadingIcon,
  Typography,
} from '@cypherock/cysync-ui';

export const DeviceUpdateLoading = () => (
  <DialogBox width={500}>
    <DialogBoxBody>
      <Container display="flex" direction="column" gap={34}>
        <LoadingIcon />
        <Typography variant="h5" $textAlign="center">
          Please wait while we check for X1 Vault updates
        </Typography>
      </Container>
    </DialogBoxBody>
  </DialogBox>
);
