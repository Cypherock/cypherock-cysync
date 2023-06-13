import React, { FC, useEffect } from 'react';
import {
  AppUpdateIcon,
  Container,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  ProgressBar,
  Typography,
} from '@cypherock/cysync-ui';

export const AppUpdating: FC<{
  title: string;
  subtext: string;
  handleComplete: () => void;
}> = ({ title, subtext, handleComplete }) => {
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    if (progress < 100) {
      setTimeout(() => {
        setProgress(progress + 1);
      }, 50);
    } else if (progress === 100) {
      handleComplete();
    }
  }, [progress]);

  return (
    <DialogBox width={500}>
      <DialogBoxBody pb={8}>
        <AppUpdateIcon />
        <Container display="flex" direction="column" gap={4}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={title} />
          </Typography>
          <Typography variant="h6" $textAlign="center" color="muted">
            <LangDisplay text={subtext} />
          </Typography>
          <ProgressBar progress={progress} versionText="version" />
        </Container>
      </DialogBoxBody>
    </DialogBox>
  );
};
