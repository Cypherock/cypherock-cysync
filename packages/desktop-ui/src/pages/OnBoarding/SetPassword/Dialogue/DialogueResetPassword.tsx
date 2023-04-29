import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
  Input,
  InputContainer,
  InputLabel,
  Divider,
  Button,
  Typography,
  Flex,
  Container,
} from '../../../../components';
import passwordHide from '../../../../assets/images/onboarding/setPass/password-hide.png';
import { Aside } from '../Aside';

export const DialogueResetPassword = (): ReactElement => (
  <Flex gap="gap0">
    <Aside screenName="Reset Password" />
    <Container variant="container" bgColor="contentGratient">
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Typography variant="h5" color="textHeading" mb="mbTwo">
            Resetting password will reset your cySync app
          </Typography>
          <Typography variant="h6" color="textMuted" mb="mbFive">
            Your funds will remain intact, and you will still be able to sync
            the data again through your X1 Vault
          </Typography>

          <InputContainer>
            <InputLabel>Enter Password</InputLabel>
            <Input type="text" placeholder="**************" />
            <img src={passwordHide} alt="passwordHide" />
          </InputContainer>

          <InputContainer>
            <InputLabel>Confirm Password</InputLabel>
            <Input type="text" placeholder="**************" />
            <img src={passwordHide} alt="passwordHide" />
          </InputContainer>

          <Divider mb="mbThree" />
          <Typography
            variant="h6"
            color="textError"
            mb="mbEight"
            textAlign="left"
          >
            Your Password is incorrect
          </Typography>

          <Typography color="textMuted">
            Use 8 or more charecters with a mix of letters, numberts & symbols
          </Typography>
          <Divider />
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Link to="/setPasswordLogin">
            <Button variation="secondary">Go Back</Button>
          </Link>
          <Link to="/setPasswordLogin">
            <Button variation="primary">Reset</Button>
          </Link>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </Container>
  </Flex>
);
