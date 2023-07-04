import {
  Container,
  DialogBox,
  DialogBoxBody,
  Image,
  loaderIcon,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

export interface AppUpdateCheckingProps {
  text: string;
}

export const AppUpdateChecking: React.FC<AppUpdateCheckingProps> = ({
  text,
}) => (
  <DialogBox width={500}>
    <DialogBoxBody>
      <Container display="flex" direction="column" gap={34}>
        <Image src={loaderIcon} alt="loader" animate="spin" $animDuration={3} />
        <Typography variant="h5" $textAlign="center">
          {text}
        </Typography>
      </Container>
    </DialogBoxBody>
  </DialogBox>
);
