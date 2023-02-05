import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxTopBar,
  Image,
  Typography,
} from "@/component";

import loader from "@/assets/images/onboarding/deviceAuth/loader.png";
export const AppClose = () => {
  return (
    <DialogueBoxContainer>
      <DialogueBoxTopBar>
        <Typography variant="h6" color="textMuted">
          Exicting
        </Typography>
      </DialogueBoxTopBar>
      <DialogueBoxBody>
        <Image src={loader} mb="mbThree" />
        <Typography variant="h5" color="textHeading">
          Thanks for contacting us. We will soon get in touch with you to assist
          you
        </Typography>
        <Typography variant="h5" color="textHeading">
          Please wait while we exit the app...
        </Typography>
      </DialogueBoxBody>
    </DialogueBoxContainer>
  );
};
