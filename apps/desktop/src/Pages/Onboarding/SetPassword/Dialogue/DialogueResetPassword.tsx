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

export const DialogueResetPassword = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <HeadingFive textHeading>
            Resetting password will reset your cySync app
          </HeadingFive>
          <HeadingSix textMuted mbFive>
            Your funds will remain intact, and you will still be able to sync
            the data again through your X1 Vault
          </HeadingSix>

          <InputContainer>
            <InputLabel>Enter Password</InputLabel>
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
            Your Password is incorrect
          </HeadingSix>
          <HeadingSmallest textMuted>
            Use 8 or more charecters with a mix of letters, numberts & symbols
          </HeadingSmallest>
          <Divider />
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button variation="Secondary">Go Back</Button>
          <Button variation="Primary">Reset</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
