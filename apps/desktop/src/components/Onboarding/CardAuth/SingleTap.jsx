import {
  DialogueBoxHeader,
  DialogueBoxContainer,
  DialogueBoxBody,
} from "../../styles/molecules/DialogueBox/DialogueBox.styled";
import {
  HeadingFour,
  HeadingFive,
  HeadingSix,
} from "../../styles/atoms/Headings/Heading.styled";
import { Flex } from "../../styles/atoms/Flex/Flex.styled";
import { Bullet } from "../../styles/atoms/Bullet/Bullet.styled";

export const SingleTap = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxBody>
          <HeadingFour textHeading mbEight>
            Pairing your cards with the device
          </HeadingFour>
          <HeadingFour mbOne textSilver>
            Place any X1 card below the X1 vault to test card tapping
          </HeadingFour>
          <HeadingFive textMuted>
            Make sure you keep it tapped until you hear a beep sound
          </HeadingFive>

          <Flex alignCenter justifyBetween>
            <HeadingFive mb0 textMuted>
              X1 Card
            </HeadingFive>
            <Bullet muted />
            {/* <Bullet success /> */}
          </Flex>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </>
  );
};
