import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
} from "../../styles/molecules/DialogueBox/DialogueBox.styled";
import {
  HeadingFive,
  HeadingSix,
} from "../../styles/atoms/Headings/Heading.styled";
import {
  InputContainer,
  InputLabel,
  Input,
} from "../../styles/atoms/Input/Input.styled";
import { Button } from "../../styles/atoms/Button/button.style";
import { Divider } from "../../styles/atoms/Divider/Divider.styled";
import passwordHide from "./password-hide.png";

export const DialogueLogin = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxBody>
          <HeadingFive textHeading>
            Enter password to access your portfolio
          </HeadingFive>
          <HeadingSix textMuted mbFive>
            Your cySync password is always stored locally on your PC
          </HeadingSix>

          <InputContainer>
            <InputLabel>Your Email</InputLabel>
            <Input type="text" placeholder="**************" />
            <img src={passwordHide} alt="" />
          </InputContainer>
          <Divider mbThree />

          <HeadingSix textError mbEight>
            Your Password is incorrect
          </HeadingSix>
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button secondary>Reset Password</Button>
          <Button primary>Login</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
