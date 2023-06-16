import React, { FC, useEffect } from 'react';
import { Typography, LangDisplay, Container } from '../../atoms';
import { DialogBox, DialogBoxBody } from './DialogBox';
import { ProgressBar } from '../ProgressBar';
import { IconProps } from '../../../assets/images/common/DeviceUpdateIcon';

interface UpdatingDialogProps {
  title: string;
  subtext: string;
  Icon: FC<IconProps>;
  handleComplete: () => void;
}

export const UpdatingDialog: FC<UpdatingDialogProps> = ({
  title,
  subtext,
  Icon,
  handleComplete,
}) => {
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
        <Icon />
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
