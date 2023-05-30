import {
  Typography,
  Image,
  DialogBox,
  DialogBoxBody,
} from '@cypherock/cysync-ui';
import React from 'react';
import { theme } from '@cypherock/cysync-ui/src/themes/theme.styled';
import { loader } from '@cypherock/cysync-ui/src/assets/images/onboarding';

export const Authenticating: React.FC = () => (
  <DialogBox width={500}>
    <DialogBoxBody>
      <Image src={loader} alt="loader" animate="spin" $animDuration={3} />
      <Typography variant="h5" $textAlign="center">
        Your X1 Vault will now be authenticated
        <br />
        through Cypherock to check its
        <br /> authenticity...(
        <span
          style={{
            background: theme.palette.golden,
            WebkitTextFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
          }}
        >
          ?
        </span>
        )
      </Typography>
    </DialogBoxBody>
  </DialogBox>
);
