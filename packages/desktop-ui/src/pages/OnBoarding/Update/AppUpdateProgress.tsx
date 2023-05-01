import React, { ReactElement } from 'react';
import appupdate from '../../../assets/images/common/app-update.png';
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  Typography,
  Flex,
  Container,
  ProgressBar,
} from '../../../components';
import { Aside } from './Aside';

export const AppUpdateProgress = (): ReactElement => (
  <Flex gap="gap0">
    <Aside screeName="App Update" />
    <Container variant="container" bgColor="contentGratient">
      <Flex position="absolute" top="topThree" right="rightThree">
        <Typography color="textMuted">Help</Typography>
        <Typography color="textGold">?</Typography>
      </Flex>

      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Image src={appupdate} mb="mbFive" />
          <Typography variant="h5" color="textHeading" mb="mbTwo">
            Updating...
          </Typography>

          <Typography variant="h6" color="textMuted" mb="mbFour">
            Wait while we update your cySync app
          </Typography>

          <Typography
            variant="h6"
            color="textMuted"
            textAlign="left"
            mb="mbTwo"
          >
            {' '}
            Version 0.2.56{' '}
          </Typography>

          <ProgressBar completed={50} />

          <Typography
            variant="h6"
            color="textMuted"
            textAlign="right"
            mt="mtOne"
          >
            {' '}
            50%{' '}
          </Typography>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </Container>
  </Flex>
);
