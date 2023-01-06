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

export const DialogueSetPassword = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxBody>
          <HeadingFive textHeading>Set your cySync password</HeadingFive>
          <HeadingSix textMuted mbFive>
            We do not store your password on our servers.
          </HeadingSix>

          <InputContainer>
            <InputLabel>New Password</InputLabel>
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
            Password mismatch and other error messages
          </HeadingSix>
          <HeadingSmallest textMuted>
            Use 8 or more charecters with a mix of letters, numberts & symbols
          </HeadingSmallest>
          <Divider />
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button secondary>Skip</Button>
          <Button primary>Confirm</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
