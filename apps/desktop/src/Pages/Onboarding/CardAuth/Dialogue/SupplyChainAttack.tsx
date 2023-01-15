import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxTopBar,
  Image,
  HeadingFive,
  HeadingSix,
  HeadingFour,
  DefaultContainer,
  Flex,
  Bullet,
  DialogueBoxFooter,
  Button,
} from "@/components/styles";
import failed from "@/assets/images/Onboarding/deviceAuth/fail.png";

export const SupplyChainAttack = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <HeadingSix textMuted mb0>
          Card Authentication
        </HeadingSix>
        <DialogueBoxBody>
          <Image src={failed} mbThree />

          <HeadingFive textHeading>Supply chain attack</HeadingFive>
          <HeadingSix textMuted>
            Your Cypherock X1 might have been compromised. Contact Cypherock
            support immediately. Close the app after you have contacted the
            support
          </HeadingSix>
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button variation="Primary"> Contact Support</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
