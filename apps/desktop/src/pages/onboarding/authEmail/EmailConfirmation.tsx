import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
  InputContainer,
  Input,
  InputLabel,
  Divider,
  Button,
  Typography,
  Flex,
  Container,
  Image,
} from "@/component";
import passwordHide from "@/assets/images/onboarding/setPass/password-hide.png";
import back from "@/assets/images/back.png";
import { Link } from "react-router-dom";
import { Aside } from "./Aside";

export const EmailConfirmation = (): JSX.Element => {
  return (
    <Flex gap0>
      <Aside />
      <Container variant="container" bgColor="contentGratient">
        <Flex position="absolute" top="topThree" right="rightThree">
          <Typography color="textMuted">Help</Typography>
          <Typography color="textGold">?</Typography>
        </Flex>
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <Typography variant="h5" color="textHeading">
              You are recommended to enter an email ID as a 2FA to get
              authenticity results
            </Typography>
            <Typography variant="h6" color="textMuted" mb="mbFive">
              We do not store this email ID permanently on our servers (?)
            </Typography>

            <InputContainer>
              <InputLabel>Your Email</InputLabel>
              <Input type="text" placeholder="**************" />
              <img src={passwordHide} alt="" />
            </InputContainer>
            <Divider mb="mbThree" />

            <Typography
              variant="h6"
              color="textError"
              mb="mbEight"
              textAlign="left"
            >
              Email entered is invalid
            </Typography>
          </DialogueBoxBody>
          <DialogueBoxFooter>
            <Link to="/deviceAuthTest">
              <Button variation="secondary">Skip</Button>
            </Link>
            <Link to="/deviceAuthTest">
              <Button variation="primary">Submit</Button>
            </Link>
          </DialogueBoxFooter>
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
