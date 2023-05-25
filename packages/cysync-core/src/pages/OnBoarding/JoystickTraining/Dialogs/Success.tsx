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
        Joystick checkup complete
      </Typography>
    </DialogBoxBody>
  </DialogBox>
);
