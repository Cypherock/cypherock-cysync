import React, { ReactElement, useEffect } from 'react';
import {
  Container,
  DialogBox,
  DialogBoxBody,
  successIcon,
  Image,
  Typography,
  ConfettiBlast,
} from '@cypherock/cysync-ui';
import { useNavigateTo } from '../../../hooks';
import { routes } from '../../../config';

export const Congratulations = (): ReactElement => {
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
              Congratulations
            </Typography>
            <Typography variant="h6" $textAlign="center" color="muted">
              Cypherock X1 is now ready to use
            </Typography>
          </Container>
        </DialogBoxBody>
      </DialogBox>
    </Container>
  );
};
