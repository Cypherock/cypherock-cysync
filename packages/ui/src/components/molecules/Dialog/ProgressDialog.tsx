import React, { FC, ReactNode, useEffect } from 'react';
import { Container, LangDisplay, Typography } from '../../atoms';
import { DialogBox, DialogBoxBody } from './DialogBox';
import { ProgressBar } from '../ProgressBar';

interface ProgressDialogProps {
  title: string;
  subtext: string;
  icon: ReactNode;
  handleComplete: () => void;
}

export const ProgressDialog: FC<ProgressDialogProps> = ({
  title,
  subtext,
  icon,
  handleComplete,
}) => {
  const [progress, setProgress] = React.useState(0);
  // eslint-disable-next-line
  let timeout: NodeJS.Timeout | null = null;
  useEffect(() => {
    if (progress < 100) {
      timeout = setTimeout(() => {
        setProgress(progress + 1);
      }, 50);
    } else if (progress === 100) {
      handleComplete();
      if (timeout) clearTimeout(timeout);
    }
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [progress]);

  return (
    <DialogBox width={500}>
      <DialogBoxBody pb={8}>
        {icon}
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
