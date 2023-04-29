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
} from '../../../../components';
import passwordHide from '../../../../assets/images/onboarding/setPass/password-hide.png';
import { Aside } from '../Aside';

export const DialogueLogin = (): ReactElement => (
  <Flex gap="gap0">
    <Aside screenName="Sign In" />
    <Container variant="container" bgColor="contentGratient">
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Typography variant="h5" color="textHeading" mb="mbTwo">
            Enter password to access your portfolio
          </Typography>

          <Typography variant="h6" color="textMuted" mb="mbFive">
            Your cySync password is always stored locally on your PC
          </Typography>

          <InputContainer>
            <InputLabel>Enter Password</InputLabel>
            <Input type="password" placeholder="**************" />
            <img src={passwordHide} alt="passwordHide" />
          </InputContainer>
          <Divider mb="mbThree" />
          <Typography
            variant="h6"
            mb="mbThree"
            textAlign="left"
            color="textError"
          >
            Your Password is incorrect
          </Typography>
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Link to="/setPasswordReset">
            <Button variation="secondary">Reset Password</Button>
          </Link>
          <Link to="/email2fa">
            <Button variation="primary">Login</Button>
          </Link>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </Container>
  </Flex>
);
