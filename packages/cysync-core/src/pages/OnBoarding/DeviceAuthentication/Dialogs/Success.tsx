import {
  Typography,
  Image,
  successIcon,
  DialogBox,
  DialogBoxBody,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React from 'react';

import { defaultConnector, DefaultConnectorProps } from '~/store';

export const BaseSuccess: React.FC<DefaultConnectorProps> = ({ lang }) => (
  <DialogBox width={500}>
    <DialogBoxBody>
      <Image src={successIcon} alt="Success Icon" />
      <Typography variant="h5" $textAlign="center">
        <LangDisplay text={lang.strings.onboarding.deviceAuth.success} />
      </Typography>
    </DialogBoxBody>
  </DialogBox>
);

export const Success = defaultConnector(BaseSuccess);
