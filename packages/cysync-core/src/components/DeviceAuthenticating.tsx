import {
  Container,
  DialogBox,
  DialogBoxBody,
  Image,
  LangDisplay,
  loaderIcon,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

export interface DeviceAuthenticatingProps {
  title: string;
  subtitle: string;
}

export const DeviceAuthenticating: React.FC<DeviceAuthenticatingProps> = ({
  title,
  subtitle,
}) => (
  <DialogBox width={500}>
    <DialogBoxBody>
      <Image src={loaderIcon} alt="loader" animate="spin" $animDuration={3} />
      <Container display="flex" direction="column" gap={4}>
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={title} />
        </Typography>
        <Typography variant="h6" $textAlign="center" color="muted">
          <LangDisplay text={subtitle} />
        </Typography>
      </Container>
    </DialogBoxBody>
  </DialogBox>
);
