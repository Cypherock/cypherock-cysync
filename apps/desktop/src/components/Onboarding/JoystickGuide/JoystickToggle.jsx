import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
} from "../../styles/molecules/DialogueBox/DialogueBox.styled";
import {
  HeadingFour,
  HeadingFive,
  HeadingSix,
  HeadingSmallest,
} from "../../styles/atoms/Headings/Heading.styled";
import joystick from "./joystick.png";
import { Image } from "../../styles/atoms/Image/Image.style";
import { Bullet } from "../../styles/atoms/Bullet/Bullet.styled";
import { Flex } from "../../styles/atoms/Flex/Flex.styled";

export const JoyStickToggle = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxBody>
          <HeadingFour textHeading mbSeven>
            Toggle Up
          </HeadingFour>

          <Flex alignCenter column mbTwo>
            <HeadingSmallest textSuccess mb0>
              Up
            </HeadingSmallest>
            <Bullet success />
          </Flex>

          <Flex alignCenter justifyCenter mbTwo>
            <Flex alignCenter>
              <HeadingSmallest textMuted mb0>
                Left
              </HeadingSmallest>
              <Bullet muted />
            </Flex>

            <Image src={joystick} />

            <Flex alignCenter>
              <Bullet muted />
              <HeadingSmallest textMuted mb0>
                Right
              </HeadingSmallest>
            </Flex>
          </Flex>

          <Flex alignCenter column mbSeven>
            <Bullet muted />
            <HeadingSmallest textMuted mb0>
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
