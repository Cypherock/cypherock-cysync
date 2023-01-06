import {
  DialogueBoxContainer,
  DialogueBoxBody,
} from "../../styles/molecules/DialogueBox/DialogueBox.styled";
import {
  HeadingFive,
  HeadingSix,
} from "../../styles/atoms/Headings/Heading.styled";

export const DeviceAuthText = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxBody>
          <HeadingFive textHeading>
            Your X1 Vault will now be authenticated through Cypherock to check
            its authenticity... (?)
          </HeadingFive>
          <HeadingSix textMuted>
            Your X1 Vault will now be authenticated through Cypherock to check
            its authenticity... (?)
          </HeadingSix>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </>
  );
};
