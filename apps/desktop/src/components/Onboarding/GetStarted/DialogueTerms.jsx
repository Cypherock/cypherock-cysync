import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxHeader,
  DialogueBoxBody,
  DialogueBoxFooter,
} from "../../styles/molecules/DialogueBox/DialogueBox.styled";
import {
  HeadingFive,
  HeadingSix,
  HeadingSmallest,
} from "../../styles/atoms/Headings/Heading.styled";
import { Button } from "../../styles/atoms/Button/button.style";
import { DefaultContainer } from "../../styles/atoms/Container/Container.styled";
import { Flex } from "../../styles/atoms/Flex/Flex.styled";
import { Bullet } from "../../styles/atoms/Bullet/Bullet.styled";
import linkImage from "./terms-link.png";
import { SquareCheckBox } from "../../styles/atoms/Checkbox/SquareCheckBox.styled";

export const DialogueTerms = () => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <DialogueBoxContainer>
      <DialogueBoxBody>
        <HeadingFive textHeading center>
          Terms of use
        </HeadingFive>
        <HeadingSix textMuted mbSix>
          Please take some time to review our Terms or Service and Privacy
          Policy
        </HeadingSix>

        <DefaultContainer bgSeparator borderRadiusOne mbTwo>
          <Flex justifyBetween>
            <Flex alignCenter gapTwo>
              <Bullet></Bullet>
              <HeadingSix textHeading mb0>
                Terms of Service
              </HeadingSix>
            </Flex>
            <a href="">
              <img src={linkImage}></img>
            </a>
          </Flex>
        </DefaultContainer>

        <DefaultContainer bgSeparator borderRadiusOne mbThree>
          <Flex justifyBetween>
            <Flex alignCenter gapTwo>
              <Bullet></Bullet>
              <HeadingSix textHeading mb0>
                Privacy Policy
              </HeadingSix>
            </Flex>
            <a href="">
              <img src={linkImage}></img>
            </a>
          </Flex>
        </DefaultContainer>

        <Flex alignCenter>
          <SquareCheckBox>
            <div>
              <input
                type="checkbox"
                onClick={() => setIsChecked((wasCheched) => !wasCheched)}
              />
            </div>
          </SquareCheckBox>
          <HeadingSmallest textMuted mb0>
            I have read and agree with the Terms of Use and Privacy Policy
          </HeadingSmallest>
        </Flex>
      </DialogueBoxBody>

      <DialogueBoxFooter>
        {isChecked ? (
          <Button primary>Confirm</Button>
        ) : (
          <Button secondary disabled={true}>
            Confirm
          </Button>
        )}
      </DialogueBoxFooter>
    </DialogueBoxContainer>
  );
};
