import {
  appUpdate,
  Button,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Image,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

export const AppUpdateConfirmation: FC<{
  title: string;
  buttonText: string;
  handleClick: () => void;
}> = ({ title, buttonText, handleClick }) => (
  <DialogBox width={500}>
    <DialogBoxBody>
      <Image src={appUpdate} alt="Device Update available" />
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
