import React, { FC } from 'react';
import {
  AlertBox,
  AppUpdateIcon,
  Container,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  CopyContainer,
  Typography,
  useTheme,
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
}) => {
  const theme = useTheme();

  return (
    <DialogBox width={500}>
      <DialogBoxBody pb={8}>
        <AppUpdateIcon color={theme.palette.warn.main} />
        <Container display="flex" direction="column" gap={4}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={title} />
          </Typography>
          <Typography variant="h6" $textAlign="center" color="muted">
            <LangDisplay text={subtext} />
          </Typography>
        </Container>
        <Container width="full" display="flex" direction="column" gap={4}>
          <CopyContainer link={linkText} />
        </Container>
        <AlertBox mt="10" variant="warning" alert={alertText} />
      </DialogBoxBody>
    </DialogBox>
  );
};
