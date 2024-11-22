import {
  Container,
  DialogBox,
  DialogBoxBody,
  Image,
  LangDisplay,
  loaderGrayIcon,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

export interface LoaderProps {
  title?: string;
  subtext?: string;
}

export const LoaderDialog: React.FC<LoaderProps> = ({ title, subtext }) => (
  <DialogBox width={500} height={300}>
    <DialogBoxBody>
      <Image
        src={loaderGrayIcon}
        $width={68}
        alt="Loader icon"
        animate="spin"
        $animDuration={3}
      />
      {title && (
        <Container display="flex" direction="column" gap={4}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={title} />
          </Typography>
          {subtext && (
            <Typography variant="h6" $textAlign="center" color="muted">
              <LangDisplay text={subtext} />
            </Typography>
          )}
        </Container>
      )}
    </DialogBoxBody>
  </DialogBox>
);

LoaderDialog.defaultProps = {
  title: undefined,
  subtext: undefined,
};
