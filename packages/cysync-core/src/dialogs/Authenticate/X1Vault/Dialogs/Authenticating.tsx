import {
  Container,
  DialogBox,
  DialogBoxBody,
  Image,
  LangDisplay,
  loaderIcon,
  Typography,
} from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

export const DeviceAuthenticating: React.FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { authenticating } = strings.dialogs.auth.authX1Vault;

  return (
    <DialogBox width={500}>
      <DialogBoxBody>
        <Image src={loaderIcon} alt="loader" animate="spin" $animDuration={3} />
        <Container display="flex" direction="column" gap={4}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={authenticating.title} />
          </Typography>
          <Typography variant="h6" $textAlign="center" color="muted">
            <LangDisplay text={authenticating.description} />
          </Typography>
        </Container>
      </DialogBoxBody>
    </DialogBox>
  );
};
