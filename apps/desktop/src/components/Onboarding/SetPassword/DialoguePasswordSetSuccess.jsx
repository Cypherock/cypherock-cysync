import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
  DialogueBoxHeader,
} from "../../styles/molecules/DialogueBox/DialogueBox.styled";
import {
  HeadingFive,
  HeadingSix,
} from "../../styles/atoms/Headings/Heading.styled";
import { Button } from "../../styles/atoms/Button/button.style";

export const DialoguePasswordSetSuccess = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxHeader>
          <HeadingSix textMuted mb0>
            Congratulations!
          </HeadingSix>
        </DialogueBoxHeader>
        <DialogueBoxBody>
          <HeadingFive textHeading>Your new password is set</HeadingFive>
          <HeadingSix textMuted>
            Please wait while take you to the login screen
          </HeadingSix>
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button primary>Go to login</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
