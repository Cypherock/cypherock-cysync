import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  HeadingFive,
  HeadingSix,
} from "@/cysync-ui";
import success from "@/assets/images/Onboarding/setPass/success.png";

export const JoyStickToggleSuccess = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Image src={success} mbThree />
          <HeadingFive textHeading>Joystick test complete</HeadingFive>
          <HeadingSix textMuted>
            Please wait while take you to the next screen
          </HeadingSix>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </>
  );
};
