import React from 'react';
import {
  Container,
  DialogBox,
  DialogBoxBody,
  Image,
  LangDisplay,
  loaderIcon,
  Typography,
} from '@cypherock/cysync-ui';

export interface DeviceUpdateLoadingProps {
  text: string;
}

export const DeviceUpdateLoading: React.FC<DeviceUpdateLoadingProps> = ({
  text,
}) => (
  <DialogBox width={500}>
    <DialogBoxBody>
      <Container display="flex" direction="column" gap={34}>
        <Image src={loaderIcon} alt="loader" animate="spin" $animDuration={3} />
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={text} />
        </Typography>
      </Container>
    </DialogBoxBody>
  </DialogBox>
);
