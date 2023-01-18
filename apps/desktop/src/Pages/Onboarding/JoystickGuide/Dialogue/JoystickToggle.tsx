import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  HeadingFive,
  HeadingSix,
  HeadingFour,
  Flex,
  Bullet,
  HeadingSmallest,
  DefaultContainer,
} from "@/cysync-ui";
import joystick from "@/assets/images/Onboarding/joystick/joystick.png";

export const JoyStickToggle = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <HeadingFour textHeading mbSeven>
            Toggle Up
          </HeadingFour>

          <Flex alignCenter column mbTwo>
            <HeadingSmallest textSuccess mb0>
              Up
            </HeadingSmallest>
            <Bullet success lg />
          </Flex>

          <Flex alignCenter justifyCenter mbTwo>
            <Flex alignCenter>
              <HeadingSmallest textMuted mb0>
                Left
              </HeadingSmallest>
              <Bullet outline />
            </Flex>

            <Image src={joystick} />
            {/* <DefaultContainer list roundedFull pThree></DefaultContainer> */}
            <Flex alignCenter>
              <Bullet lg gold />
              <HeadingSmallest textGold mb0>
                Right
              </HeadingSmallest>
            </Flex>
          </Flex>

          <Flex alignCenter column mbSeven>
            <Bullet failed lg />
            <HeadingSmallest textError mb0>
              Down
            </HeadingSmallest>
          </Flex>
          <HeadingFive textHeading>
            X1 Vault provides 4 way joystick for screen navigation
          </HeadingFive>
          <HeadingSix textMuted>
            Follow the instruction on the device
          </HeadingSix>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </>
  );
};
