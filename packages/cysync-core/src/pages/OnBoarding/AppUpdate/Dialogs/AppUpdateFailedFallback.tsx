import React, { FC } from 'react';
import {
  AlertBox,
  AppUpdateIcon,
  Container,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  CopyLink,
  Typography,
} from '@cypherock/cysync-ui';

interface AppUpdateFailedFallbackProps {
  title: string;
  subtext: string;
  linkText: string;
  alertText: string;
}

export const AppUpdateFailedFallback: FC<AppUpdateFailedFallbackProps> = ({
  title,
  subtext,
  linkText,
  alertText,
}) => (
  <DialogBox width={500}>
    <DialogBoxBody pb={8}>
      <AppUpdateIcon color="#FF624C" />
      <Container display="flex" direction="column" gap={4}>
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={title} />
        </Typography>
        <Typography variant="h6" $textAlign="center" color="muted">
          <LangDisplay text={subtext} />
        </Typography>
      </Container>
      <Container width="full" display="flex" direction="column" gap={4}>
        <CopyLink link={linkText} />
      </Container>
      <AlertBox mt="10" variant="warning" alert={alertText} />
    </DialogBoxBody>
  </DialogBox>
);
