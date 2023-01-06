import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
} from "../../styles/molecules/DialogueBox/DialogueBox.styled";
import {
  HeadingFive,
  HeadingSix,
  HeadingSmallest,
} from "../../styles/atoms/Headings/Heading.styled";
import {
  InputContainer,
  InputLabel,
  Input,
} from "../../styles/atoms/Input/Input.styled";
import { Button } from "../../styles/atoms/Button/button.style";
import { Divider } from "../../styles/atoms/Divider/Divider.styled";
import passwordHide from "./password-hide.png";

export const DialogueResetPassword = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxBody>
          <HeadingFive textHeading>
            Resetting password will reset your cySync app data
          </HeadingFive>
          <HeadingSix textMuted mbFive>
            Your funds will remain intact, and you will still be able to sync
            the data again through your X1 Vault
          </HeadingSix>

          <InputContainer>
            <InputLabel>Enter Password</InputLabel>
            <Input type="text" placeholder="**************" />
            <img src={passwordHide} alt="" />
          </InputContainer>

          <InputContainer>
            <InputLabel>Confirm Password</InputLabel>
            <Input type="text" placeholder="**************" />
            <img src={passwordHide} alt="" />
          </InputContainer>
          <Divider mbThree />

          <HeadingSix textError mbEight>
            Your Password is incorrect
          </HeadingSix>
          <HeadingSmallest textMuted>
            Use 8 or more charecters with a mix of letters, numberts & symbols
          </HeadingSmallest>
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button secondary>Go Back</Button>
          <Button primary>Reset</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
