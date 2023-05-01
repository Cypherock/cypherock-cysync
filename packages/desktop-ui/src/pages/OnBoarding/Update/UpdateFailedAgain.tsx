import React, { ReactElement } from 'react';
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  Typography,
  Flex,
  Container,
  ClipboardBar,
} from '../../../components';
import updatefail from '../../../assets/images/common/update-fail.png';
import { Aside } from './Aside';

export const UpdateFailedAgain = (): ReactElement => (
  <Flex gap="gap0">
    <Aside screeName="App Update" />
    <Container variant="container" bgColor="contentGratient">
      <Flex position="absolute" top="topThree" right="rightThree">
        <Typography color="textMuted">Help</Typography>
        <Typography color="textGold">?</Typography>
      </Flex>

      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Image src={updatefail} mb="mbFive" />
          <Typography variant="h5" color="textHeading" mb="mbTwo">
            cySync app update to version 0.22.56 failed
          </Typography>

          <Typography variant="h6" color="textMuted">
            Reinstall the desktop app from the link below and try again
          </Typography>

          <Typography variant="h6" color="textMuted" mt="mtFour" mb="mbSix">
            Close this app before installing the latest cySync app from the link
          </Typography>

          {/* TODO: Add a copy icon here */}
          <ClipboardBar placeholder="https://www.cypherock.com/gs/" />
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </Container>
  </Flex>
);
