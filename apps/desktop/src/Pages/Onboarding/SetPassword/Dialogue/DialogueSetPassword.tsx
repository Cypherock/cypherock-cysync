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
  HeadingSmallest,
  HeadingFive,
  HeadingSix,
} from "@/components/styles";
import passwordHide from "@/assets/images/Onboarding/setPass/password-hide.png";

export const DialogueSetPassword = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <HeadingFive textHeading>Set your cySync password</HeadingFive>
          <HeadingSix textMuted mbFive>
            We do not store your password on our servers.
          </HeadingSix>

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
          <Divider mbThree />

          <HeadingSix textError mbEight textLeft>
            Password mismatch and other error messages
          </HeadingSix>
          <HeadingSmallest textMuted>
            Use 8 or more charecters with a mix of letters, numberts & symbols
          </HeadingSmallest>
          <Divider />
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button variation="Secondary">Skip</Button>
          <Button variation="Primary">Confirm</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
