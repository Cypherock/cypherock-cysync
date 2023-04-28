import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
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
} from '../../../components';
//   import passwordHide from "@assets/images/onboarding/setPass/password-hide.png";
//   import back from "@assets/images/back.png";
import { Aside } from './Aside';

export const EmailConfirmation = (): ReactElement => (
  <Flex gap="gap0">
    <Aside />
    <Container variant="container" bgColor="contentGratient">
      <Flex position="absolute" top="topThree" right="rightThree">
        <Typography color="textMuted">Help</Typography>
        <Typography color="textGold">?</Typography>
      </Flex>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Typography variant="h5" color="textHeading" mb="mbTwo">
            You are recommended to enter an email ID as a 2FA to get
            authenticity results
          </Typography>
          <Typography variant="h6" color="textMuted" mb="mbFive">
            We do not store this email ID permanently on servers (
            <Typography color="textGold" display="inline" variant="h6">
              ?
            </Typography>
            )
          </Typography>

          <InputContainer>
            <InputLabel>Your Email</InputLabel>
            <Input type="text" placeholder="**************" />
            {/* <img src={passwordHide} alt="" /> */}
          </InputContainer>
          <Divider mb="mbThree" />

          <Typography
            variant="h6"
            color="textError"
            mb="mbEight"
            textAlign="left"
          >
            Password mismatch and other error messages
          </Typography>
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Link to="/deviceAuthTest">
            <Button variation="secondary">Skip</Button>
          </Link>
          <Link to="/deviceAuthTest">
            <Button variation="primary">Continue</Button>
          </Link>
        </DialogueBoxFooter>
      </DialogueBoxContainer>

      <Link to="/setPassword">
        <Flex
          position="absolute"
          bottom="bottomThree"
          left="backBottom"
          gap="gapOne"
          align="center"
        >
          {/* <Image src={back} /> */}
          <Typography color="textMuted">Back</Typography>
        </Flex>
      </Link>
    </Container>
  </Flex>
);
