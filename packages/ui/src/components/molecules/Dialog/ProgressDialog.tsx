import React, { FC, ReactNode, useEffect } from 'react';

import { DialogBox, DialogBoxBody } from './DialogBox';

import { Container, LangDisplay, Typography } from '../../atoms';
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
  // eslint-disable-next-line
  const timer = React.useRef<NodeJS.Timeout | null>(null);
  const [progress, setProgress] = React.useState(0);

  useEffect(() => {
    timer.current = setTimeout(() => {
      if (progress < 100) setProgress(progress + 1);
      else handleComplete();
    }, 50);
    return () => {
      if (timer.current) clearTimeout(timer.current);
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
