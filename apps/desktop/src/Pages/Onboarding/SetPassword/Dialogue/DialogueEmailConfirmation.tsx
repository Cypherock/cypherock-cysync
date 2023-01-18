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
} from "@/cysync-ui";
import passwordHide from "@/assets/images/Onboarding/setPass/password-hide.png";

export const DialogueEmailConfirmation = (): JSX.Element => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <HeadingFive textHeading>
            You are recommended to enter an email ID as a 2FA to get
            authenticity results
          </HeadingFive>
          <HeadingSix textMuted mbFive>
            We do not store this email ID permanently on our servers (?)
          </HeadingSix>

          <InputContainer>
            <InputLabel>Your Email</InputLabel>
            <Input type="text" placeholder="**************" />
            <img src={passwordHide} alt="" />
          </InputContainer>
          <Divider mbThree />

          <HeadingSix textError mbEight textLeft>
            Email entered is invalid
          </HeadingSix>
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button variation="Secondary">Skip</Button>
          <Button variation="Primary">Submit</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
