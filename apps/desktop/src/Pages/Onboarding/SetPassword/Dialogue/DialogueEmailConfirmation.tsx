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

export const DialogueEmailConfirmation = (): JSX.Element => {
  return (
    <>
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
          <Button variation="secondary">Skip</Button>
          <Button variation="rimary">Submit</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
