import React, { ReactElement } from 'react';
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  Typography,
  Flex,
  Container,
} from '../../../components';
import updateSuccess from '../../../assets/images/onboarding/setPass/success.png';
import { Aside } from './Aside';

export const AppUpdateSuccess = (): ReactElement => (
  <Flex gap="gap0">
    <Aside screeName="App Update" />
    <Container variant="container" bgColor="contentGratient">
      <Flex position="absolute" top="topThree" right="rightThree">
        <Typography color="textMuted">Help</Typography>
        <Typography color="textGold">?</Typography>
      </Flex>

      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Image src={updateSuccess} mb="mbFive" />
          <Typography variant="h5" color="textHeading" mb="mbTwo">
            cySync app updated successfully
          </Typography>

          <Typography variant="h6" color="textMuted">
            Wait while we restart the app. In case, the app does not restart
            itself, manually start it again
          </Typography>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </Container>
  </Flex>
);
