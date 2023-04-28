import React, { ReactElement } from 'react';
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Typography,
  Flex,
  Container,
} from '../../../components';
// import loader from "@assets/images/onboarding/deviceAuth/loader.png";
import { Aside } from './Aside';

export const DeviceAuthTest = (): ReactElement => (
  <Flex gap="gap0">
    <Aside />
    <Container variant="container" bgColor="contentGratient">
      <Flex position="absolute" top="topThree" right="rightThree">
        <Typography color="textMuted">Help</Typography>
        <Typography color="textGold">?</Typography>
      </Flex>

      <DialogueBoxContainer md>
        <DialogueBoxBody>
          {/* <Image src={loader} mb="mbFive" /> */}
          <Typography variant="h5" color="textHeading" mb="mbTwo">
            Your X1 Vault will now be authenticated through Cypherock to check
            its authenticity... (?)
          </Typography>

          <Typography variant="h6" color="textMuted">
            Do not disconnect your X1 Vault while the operation is being done
          </Typography>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </Container>
  </Flex>
);
