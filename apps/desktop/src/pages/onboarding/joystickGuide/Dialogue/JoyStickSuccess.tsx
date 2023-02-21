import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  Typography,
  Flex,
  Container,
} from "@components";
import success from "@/assets/images/onboarding/setPass/success.png";

export const JoyStickToggleSuccess = () => {
  return (
    <Flex gap0>
      <Container variant="asideContainer" bgColor="sideBar" size="lg" />
      <Container variant="container" bgColor="contentGratient">
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Image src={success} mb="mbThree" />
            <Typography variant="h5" color="textHeading">
              Joystick test complete
            </Typography>
            <Typography variant="h6" color="textMuted">
              Please wait while take you to the next screen
            </Typography>
          </DialogueBoxBody>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};
