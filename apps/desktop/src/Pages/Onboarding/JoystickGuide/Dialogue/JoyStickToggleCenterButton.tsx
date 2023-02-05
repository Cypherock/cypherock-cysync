import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  Typography,
} from "@/component";
import centerButton from "@/assets/images/onboarding/joystick/centerButton.png";
import centerButtonSuccess from "@/assets/images/onboarding/joystick/centerButtonSuccess.png";

export const JoyStickToggleCenterButton = () => {
  return (
    <DialogueBoxContainer md>
      <DialogueBoxBody>
        <Typography variant="h4" color="textHeading" mb="mbSeven">
          Center click the joystick to proceed
        </Typography>

        {/* <Image src={centerButton} mbSeven /> */}
        <Image src={centerButtonSuccess} mb="mbSeven" />

        <Typography variant="h5" color="textHeading" mb="mbOne">
          X1 Vault has a center button to perform click
        </Typography>

        <Typography variant="h6" color="textMuted">
          Follow the instruction on the device
        </Typography>
      </DialogueBoxBody>
    </DialogueBoxContainer>
  );
};
