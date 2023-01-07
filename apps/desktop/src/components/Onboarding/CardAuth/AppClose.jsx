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
} from "../../styles/atoms/Headings/Heading.styled";
import { Flex } from "../../styles/atoms/Flex/Flex.styled";
import { Bullet } from "../../styles/atoms/Bullet/Bullet.styled";
import { DefaultContainer } from "../../styles/atoms/Container/Container.styled";
import { Button } from "../../styles/atoms/Button/button.style";
import { Image } from "../../styles/atoms/Image/Image.style";
import exiting from "./exiting.png";

export const AppClose = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxHeader>
          <HeadingSix textMuted mb0>
            Support
          </HeadingSix>
        </DialogueBoxHeader>
        <DialogueBoxBody>
          <Image src={exiting} mbThree />

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
