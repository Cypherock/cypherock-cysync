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
} from "@/component";
import passwordHide from "@/assets/images/Onboarding/setPass/password-hide.png";

export const DialogueLogin = () => {
  return (
    <DialogueBoxContainer>
      <DialogueBoxBody>
        <Typography variant="h5" color="textHeading">
          Enter password to access your portfolio
        </Typography>

        <Typography variant="h6" color="textMuted" mb="mbFive">
          Your cySync password is always stored locally on your PC
        </Typography>

        <InputContainer>
          <InputLabel>Your Email</InputLabel>
          <Input type="text" placeholder="**************" />
          <img src={passwordHide} alt="" />
        </InputContainer>
        <Divider mb="mbThree" />
        <Typography
          variant="h6"
          mb="mbEight"
          textAlign="left"
          color="textError"
        >
          Your Password is incorrect
        </Typography>
      </DialogueBoxBody>
      <DialogueBoxFooter>
        <Button variation="secondary">Reset Password</Button>
        <Button variation="primary">Login</Button>
      </DialogueBoxFooter>
    </DialogueBoxContainer>
  );
};
