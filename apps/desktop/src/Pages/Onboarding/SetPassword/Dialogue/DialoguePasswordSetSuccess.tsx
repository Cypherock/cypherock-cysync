import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  Typography,
} from "@/component";
import success from "@/assets/images/Onboarding/setPass/success.png";

export const DialoguePasswordSetSuccess = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Image src={success} mb="mbFour" />
          <Typography variant="h5" color="textHeading">
            Your new password is set
          </Typography>
          <Typography variant="h6" color="textMuted">
            Please wait while take you to the login screen
          </Typography>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </>
  );
};
