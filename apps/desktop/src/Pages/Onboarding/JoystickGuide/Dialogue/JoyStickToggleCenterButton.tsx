import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  HeadingFive,
  HeadingSix,
  HeadingFour,
} from "@/components/styles";
import centerButton from "@/assets/images/Onboarding/joystick/centerButton.png";
import centerButtonSuccess from "@/assets/images/Onboarding/joystick/centerButtonSuccess.png";

export const JoyStickToggleCenterButton = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <HeadingFour textHeading mbSeven>
            Center click the joystick to proceed
          </HeadingFour>

          {/* <Image src={centerButton} mbSeven /> */}
          <Image src={centerButtonSuccess} mbSeven />

          <HeadingFive textHeading mbOne>
            X1 Vault has a center button to perform click
          </HeadingFive>

          <HeadingSix textMuted>
            Follow the instruction on the device
          </HeadingSix>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </>
  );
};
