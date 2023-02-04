import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  Typography,
} from "@/component";
import success from "@/assets/images/Onboarding/setPass/success.png";

export const JoyStickToggleSuccess = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Image src={success} mb="mbThree" />
          <Typography variant="h5" color="textHeading">
            Joystick test complete
          </Typography>
          <Typography variant="h6" color="textMuted">
            Please wait while take you to the next screen
          </Typography>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </>
  );
};
