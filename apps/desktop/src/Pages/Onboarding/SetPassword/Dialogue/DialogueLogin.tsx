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
  HeadingFive,
  HeadingSix,
} from "@/components/styles";
import passwordHide from "@/assets/images/Onboarding/setPass/password-hide.png";

export const DialogueLogin = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxBody>
          <HeadingFive textHeading>
            Enter password to access your portfolio
          </HeadingFive>
          <HeadingSix textMuted mbFive>
            Your cySync password is always stored locally on your PC
          </HeadingSix>

          <InputContainer>
            <InputLabel>Your Email</InputLabel>
            <Input type="text" placeholder="**************" />
            <img src={passwordHide} alt="" />
          </InputContainer>
          <Divider mbThree />

          <HeadingSix textError mbEight textLeft>
            Your Password is incorrect
          </HeadingSix>
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button variation="Secondary">Reset Password</Button>
          <Button variation="Primary">Login</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
