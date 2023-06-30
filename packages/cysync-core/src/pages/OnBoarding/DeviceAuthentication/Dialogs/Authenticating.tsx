import {
  QuestionMarkButton,
  DialogBox,
  DialogBoxBody,
  Image,
  LangDisplay,
  loaderIcon,
  Typography,
  Container,
} from '@cypherock/cysync-ui';
import React from 'react';

import { useAppSelector, selectLanguage } from '~/store';

export const DeviceAuthenticating: React.FC = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <DialogBox width={500}>
      <DialogBoxBody>
        <Image src={loaderIcon} alt="loader" animate="spin" $animDuration={3} />
        <Container display="flex" direction="column" gap={4}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={lang.strings.onboarding.deviceAuth.title} />
            ...
            <QuestionMarkButton />
          </Typography>
          <Typography variant="h6" $textAlign="center" color="muted">
            <LangDisplay text={lang.strings.onboarding.deviceAuth.subtext} />
          </Typography>
        </Container>
      </DialogBoxBody>
    </DialogBox>
  );
};
