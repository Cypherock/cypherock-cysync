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
  HeadingSmallest,
} from "../../styles/atoms/Headings/Heading.styled";
import {
  InputContainer,
  InputLabel,
  Input,
} from "../../styles/atoms/Input/Input.styled";
import { Divider } from "../../styles/atoms/Divider/Divider.styled";
import { SquareCheckBox } from "../../styles/atoms/Checkbox/SquareCheckBox.styled";
import { Flex } from "../../styles/atoms/Flex/Flex.styled";
import { Bullet } from "../../styles/atoms/Bullet/Bullet.styled";
import { DefaultContainer } from "../../styles/atoms/Container/Container.styled";
import { Button } from "../../styles/atoms/Button/button.style";
import { Image } from "../../styles/atoms/Image/Image.style";
import exiting from "./exiting.png";

export const Support = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxHeader>
          <HeadingSix textMuted mb0>
            Contact us
          </HeadingSix>
        </DialogueBoxHeader>
        <DialogueBoxBody>
          <HeadingFive textHeading>How can we help</HeadingFive>
          <HeadingSix textMuted mbSix>
            Our friendly team would love to hear from you
          </HeadingSix>

          <InputContainer>
            <InputLabel> Email</InputLabel>
            <Input type="text" placeholder="Your email" />
            {/* <img src={passwordHide} alt="" /> */}
          </InputContainer>
          <Flex alignCenter mbTwo>
            <SquareCheckBox>
              <div>
                <input
                  type="checkbox"
                  onClick={() => setIsChecked((wasCheched) => !wasCheched)}
                />
              </div>
            </SquareCheckBox>
            <HeadingSmallest textMuted mb0>
              Attach Application Logs
            </HeadingSmallest>
          </Flex>

          <Flex alignCenter mbTwo>
            <SquareCheckBox>
              <div>
                <input
                  type="checkbox"
                  onClick={() => setIsChecked((wasCheched) => !wasCheched)}
                />
              </div>
            </SquareCheckBox>
            <HeadingSmallest textMuted mb0>
              Attach Device Logs
            </HeadingSmallest>
          </Flex>
          <Divider mbThree />

          <HeadingSix textError mbEight>
            Your Password is incorrect
          </HeadingSix>
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button secondary> Cancel </Button>
          <Button primary>Submit & Close app</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
