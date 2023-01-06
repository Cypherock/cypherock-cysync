import {
  DialogueBoxHeader,
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
import success from "./success.png";
import { Image } from "../../styles/atoms/Image/Image.style";
import { Bullet } from "../../styles/atoms/Bullet/Bullet.styled";
import { Flex } from "../../styles/atoms/Flex/Flex.styled";

export const JoyStickToggleSuccess = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxHeader>
          <HeadingSix textMuted mb0>
            Joystick Checkup
          </HeadingSix>
        </DialogueBoxHeader>
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
