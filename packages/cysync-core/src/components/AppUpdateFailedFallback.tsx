import {
  AlertBox,
  Container,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
  CopyContainer,
  Typography,
  CySyncDownloadRedIcon,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

interface AppUpdateFailedFallbackProps {
  title: string;
  subtext: string;
  linkText: string;
  alertText: string;
  textVariables?: object;
  onClose?: () => void;
  dontCloseOnEscape?: boolean;
}

export const AppUpdateFailedFallback: FC<AppUpdateFailedFallbackProps> = ({
  title,
  subtext,
  linkText,
  alertText,
  textVariables,
  onClose,
  dontCloseOnEscape,
}) => (
  <DialogBox
    width={500}
    onClose={onClose}
    dontCloseOnEscape={dontCloseOnEscape}
  >
    <DialogBoxBody pb={8}>
      <CySyncDownloadRedIcon />
      <Container display="flex" direction="column" gap={4}>
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={title} variables={textVariables} />
        </Typography>
        <Typography variant="h6" $textAlign="center" color="muted">
          <LangDisplay text={subtext} variables={textVariables} />
        </Typography>
      </Container>
      <Container width="full" display="flex" direction="column" gap={4}>
        <CopyContainer link={linkText} />
      </Container>
      <AlertBox mt="10" variant="warning" alert={alertText} />
    </DialogBoxBody>
  </DialogBox>
);

AppUpdateFailedFallback.defaultProps = {
  textVariables: undefined,
  onClose: undefined,
  dontCloseOnEscape: undefined,
};
