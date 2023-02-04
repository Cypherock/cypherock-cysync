import { useState } from "react";
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
} from "@/component";
import passwordHide from "@/assets/images/Onboarding/setPass/password-hide.png";

export const DialogueSetPassword = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Typography variant="h5" color="textHeading">
            Set your cySync password
          </Typography>
          <Typography variant="h6" color="textMuted" mb="mbFive">
            We do not store your password on our servers.
          </Typography>

          <InputContainer>
            <InputLabel>New Password</InputLabel>
            <Input type="text" placeholder="**************" />
            <img src={passwordHide} alt="" />
          </InputContainer>

          <InputContainer>
            <InputLabel>Confirm Password</InputLabel>
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
            Password mismatch and other error messages
          </Typography>
          <Typography variant="h6" color="textMuted">
            Use 8 or more charecters with a mix of letters, numberts & symbols
          </Typography>

          <Divider />
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button variation="secondary">Skip</Button>
          <Button variation="primary">Confirm</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
