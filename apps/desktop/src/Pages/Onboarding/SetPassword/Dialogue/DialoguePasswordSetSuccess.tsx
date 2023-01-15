import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  HeadingFive,
  HeadingSix,
} from "@/components/styles";
import success from "@/assets/images/Onboarding/setPass/success.png";

export const DialoguePasswordSetSuccess = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Image src={success} mbFour />
          <HeadingFive textHeading>Your new password is set</HeadingFive>
          <HeadingSix textMuted>
            Please wait while take you to the login screen
          </HeadingSix>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </>
  );
};
