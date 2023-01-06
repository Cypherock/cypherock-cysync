import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxHeader,
  DialogueBoxFooter,
} from "../../styles/molecules/DialogueBox/DialogueBox.styled";
import {
  HeadingFive,
  HeadingSix,
} from "../../styles/atoms/Headings/Heading.styled";
import { Button } from "../../styles/atoms/Button/button.style";

export const DeviceAuthTestSuccess = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxHeader>
          <HeadingSix textMuted mb0>
            Congratulations!
          </HeadingSix>
        </DialogueBoxHeader>
        <DialogueBoxBody>
          <HeadingFive textHeading>Your device is authenticated</HeadingFive>
          <HeadingSix textMuted>
            Please wait while take you to the next screen
          </HeadingSix>
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button primary>Next</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
