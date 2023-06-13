import React, { FC } from 'react';
import {
  successIcon,
  Container,
  DialogBox,
  DialogBoxBody,
  Image,
  LangDisplay,
  AlertBox,
  Typography,
} from '@cypherock/cysync-ui';

interface AppUpdateSuccessfulProps {
  title: string;
  subtext: string;
  infoText: string;
}

export const AppUpdateSuccessful: FC<AppUpdateSuccessfulProps> = ({
  title,
  subtext,
  infoText,
}) => (
  <DialogBox width={500}>
    <DialogBoxBody pb={8}>
      <Image src={successIcon} alt="App updating" />
      <Container display="flex" direction="column" gap={4}>
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={title} />
        </Typography>
        <Typography variant="h6" $textAlign="center" color="muted">
          <LangDisplay text={subtext} />
        </Typography>
        <AlertBox alert={infoText} />
      </Container>
    </DialogBoxBody>
  </DialogBox>
);
