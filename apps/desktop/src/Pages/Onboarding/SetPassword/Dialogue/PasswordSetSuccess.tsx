import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  Typography,
  Flex,
  Container,
} from "@/component";
import success from "@/assets/images/onboarding/setPass/success.png";
import { Aside } from "../Aside";
import { Link } from "react-router-dom";
import back from "@/assets/images/back.png";

export const PasswordSetSuccess = () => {
  return (
    <Flex gap0>
      <Aside />
      <Container variant="container" bgColor="contentGratient">
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Image src={success} mb="mbFour" />
            <Typography variant="h5" color="textHeading">
              Your new password is set
            </Typography>
            <Typography variant="h6" color="textMuted">
              Please wait while take you to the login screen
            </Typography>
          </DialogueBoxBody>
        </DialogueBoxContainer>

        <Link to="/setPassword">
          <Flex
            position="absolute"
            bottom="bottomThree"
            left="backBottom"
            gapOne
            alignCenter
          >
            <Image src={back} />
            <Typography color="textMuted">Back</Typography>
          </Flex>
        </Link>
      </Container>
    </Flex>
  );
};
