import {
  DialogueBoxContainer,
  DialogueBoxBody,
} from "../../styles/molecules/DialogueBox/DialogueBox.styled";
import { HeadingFive } from "../../styles/atoms/Headings/Heading.styled";
import { Button } from "../../styles/atoms/Button/button.style";
export const DialogueWelcome = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxBody>
          <HeadingFive textMuted mbFive>
            Ensure the following before you continue
          </HeadingFive>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </>
  );
};
