import React, { useEffect } from 'react';
import {
  Container,
  DialogBox,
  DialogBoxBody,
  successIcon,
  Image,
  Typography,
  ConfettiBlast,
  LangDisplay,
} from '@cypherock/cysync-ui';

import { useNavigateTo } from '~/hooks';
import { routes } from '~/constants';
import { useAppSelector, selectLanguage } from '~/store';

export const Congratulations: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const navigateTo = useNavigateTo();

  useEffect(() => {
    // will be replaced for navigating to main app
    navigateTo(routes.onboarding.deviceDetection.path, 3800);
  }, []);

  return (
    <Container height="screen" $bgColor="sideBar" display="flex">
      <ConfettiBlast />
      <DialogBox width={500}>
        <DialogBoxBody>
          <Image src={successIcon} alt="Success Icon" />
          <Container display="flex" direction="column" gap={4} mb={4}>
            <Typography variant="h5" $textAlign="center">
              <LangDisplay text={lang.strings.onboarding.success.title} />
            </Typography>
            <Typography variant="h6" $textAlign="center" color="muted">
              <LangDisplay text={lang.strings.onboarding.success.subtext} />
            </Typography>
          </Container>
        </DialogBoxBody>
      </DialogBox>
    </Container>
  );
};
