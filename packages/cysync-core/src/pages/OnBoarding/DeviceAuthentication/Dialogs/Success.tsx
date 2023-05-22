import {
  Typography,
  Image,
  successIcon,
  DialogBox,
  DialogBoxBody,
} from '@cypherock/cysync-ui';
import React from 'react';

export const Success: React.FC = () => (
  <DialogBox width={500}>
    <DialogBoxBody>
      <Image src={successIcon} alt="Success Icon" />
      <Typography variant="h5" $textAlign="center">
        Your X1 Vault is successfully authenticated
      </Typography>
    </DialogBoxBody>
  </DialogBox>
);
