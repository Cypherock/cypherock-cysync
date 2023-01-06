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

export const DialogueEmailConfirmation = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxBody>
          <HeadingFive textHeading>
            You are recommended to enter an email ID as a 2FA to get
            authenticity results
          </HeadingFive>
          <HeadingSix textMuted mbFive>
            We do not store this email ID permanently on our servers (?)
          </HeadingSix>

          <InputContainer>
            <InputLabel>Your Email</InputLabel>
            <Input type="text" placeholder="**************" />
            <img src={passwordHide} alt="" />
          </InputContainer>
          <Divider mbThree />

          <HeadingSix textError mbEight>
            Email entered is invalid
          </HeadingSix>
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button secondary>Skip</Button>
          <Button primary>Submit</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
