import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  HeadingFive,
  HeadingSix,
  Typography,
} from "@/component";
import success from "@/assets/images/Onboarding/setPass/success.png";

export const DeviceAuthTestSuccess = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Image src={success} />
          <Typography color="textHeading">
            Your X1 Vault is successfully authenticated
          </Typography>
          <Typography color="textMuted">
            Please wait while take you to the next screen
          </Typography>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </>
  );
};
