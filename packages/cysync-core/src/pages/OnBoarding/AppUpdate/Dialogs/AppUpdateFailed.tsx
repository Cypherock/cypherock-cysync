import React, { FC } from 'react';
import {
  AppUpdateIcon,
  Button,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';

interface AppUpdateFailedProps {
  title: string;
  buttonText: string;
  handleClick: () => void;
}

export const AppUpdateFailed: FC<AppUpdateFailedProps> = ({
  title,
  buttonText,
  handleClick,
}) => (
  <DialogBox width={500}>
    <DialogBoxBody>
      <AppUpdateIcon color="#FF624C" />
      <Container display="flex" direction="column" gap={4}>
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={title} />
        </Typography>
      </Container>
    </DialogBoxBody>
    <DialogBoxFooter>
      <Button onClick={handleClick} variant="primary">
        <LangDisplay text={buttonText} />
      </Button>
    </DialogBoxFooter>
  </DialogBox>
);
