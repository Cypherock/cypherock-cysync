import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  HeadingFive,
  HeadingSix,
} from "@/components/styles";
import success from "@/assets/images/Onboarding/setPass/success.png";

export const DeviceAuthTestSuccess = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Image src={success} />
          <HeadingFive textHeading>
            Your X1 Vault is successfully authenticated
          </HeadingFive>
          <HeadingSix textMuted>
            Please wait while take you to the next screen
          </HeadingSix>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </>
  );
};
