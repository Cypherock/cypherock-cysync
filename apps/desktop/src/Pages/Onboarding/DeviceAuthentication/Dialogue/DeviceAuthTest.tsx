import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  Typography,
} from "@/component";
import loader from "@/assets/images/Onboarding/deviceAuth/loader.png";

export const DeviceAuthText = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Image src={loader} mb="mbFive" />
          <Typography variant="h6" color="textHeading">
            Your X1 Vault will now be authenticated through Cypherock to check
            its authenticity... (?)
          </Typography>

          <Typography variant="h5" color="textMuted">
            Do not disconnect your X1 Vault while the operation is being done
          </Typography>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </>
  );
};
