import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxTopBar,
  Image,
  HeadingFive,
  HeadingSix,
} from "@/cysync-ui";

import loader from "@/assets/images/Onboarding/deviceAuth/loader.png";
export const AppClose = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxTopBar>
          <HeadingSix textMuted mb0>
            Exicting
          </HeadingSix>
        </DialogueBoxTopBar>
        <DialogueBoxBody>
          <Image src={loader} mbThree />

          <HeadingFive textHeading>
            Thanks for contacting us. We will soon get in touch with you to
            assist you
          </HeadingFive>
          <HeadingSix textMuted>
            Please wait while we exit the app...
          </HeadingSix>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </>
  );
};
