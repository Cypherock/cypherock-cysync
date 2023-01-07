import {
  DialogueBoxHeader,
  DialogueBoxContainer,
  DialogueBoxBody,
} from "../../styles/molecules/DialogueBox/DialogueBox.styled";
import {
  HeadingFive,
  HeadingSix,
} from "../../styles/atoms/Headings/Heading.styled";
import success from "./success.png";
import { Image } from "../../styles/atoms/Image/Image.style";

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
