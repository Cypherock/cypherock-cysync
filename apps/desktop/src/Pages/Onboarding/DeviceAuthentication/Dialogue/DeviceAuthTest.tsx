import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  HeadingFive,
  HeadingSix,
  Image,
} from "@/components/styles";
import loader from "@/assets/images/Onboarding/deviceAuth/loader.png";

export const DeviceAuthText = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Image src={loader} mbFive />
          <HeadingFive textHeading>
            Your X1 Vault will now be authenticated through Cypherock to check
            its authenticity... (?)
          </HeadingFive>
          <HeadingSix textMuted>
            Do not disconnect your X1 Vault while the operation is being done
          </HeadingSix>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </>
  );
};
