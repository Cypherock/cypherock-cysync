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
} from "@/components/styles";

export const SingleTap = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <HeadingFive textHeading>
            Tap any X1 Card below the X1 Vault to test card tapping
          </HeadingFive>
          <HeadingSix textMuted mbFive>
            Your X1 card communicates with the X1 Vault through encrypted NFC.
            Make sure you keep it tapped until you hear a beep sound
          </HeadingSix>

          <DefaultContainer list border roundedOne>
            <Flex alignCenter justifyBetween>
              <HeadingSix mb0 textMuted>
                X1 Card
              </HeadingSix>
              <Bullet lg gold />
            </Flex>
          </DefaultContainer>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </>
  );
};
