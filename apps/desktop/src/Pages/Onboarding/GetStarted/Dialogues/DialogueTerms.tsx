import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
  Bullet,
  Button,
  HeadingFive,
  HeadingSix,
  HeadingSmallest,
  DefaultContainer,
  Flex,
  SquareCheckBox,
} from "@/cysync-ui";
import linkImage from "@/assets/images/Onboarding/getStarted/terms-link.png";

export const DialogueTerms = (): JSX.Element => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <DialogueBoxContainer md>
      <DialogueBoxBody>
        <HeadingFive textHeading>Terms of use</HeadingFive>
        <HeadingSix textMuted mbSix>
          Please take some time to review our Terms or Service and Privacy
          Policy
        </HeadingSix>

        <DefaultContainer mbTwo roundedOne list border>
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

        <DefaultContainer mbThree roundedOne list border>
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
          <HeadingSmallest textMuted mb0 textLeft>
            I have read and agree with the Terms of Use and Privacy Policy
          </HeadingSmallest>
        </Flex>
      </DialogueBoxBody>

      <DialogueBoxFooter>
        {isChecked ? (
          <Button variation="Primary">Confirm</Button>
        ) : (
          <Button variation="Secondary" disabled={true}>
            Confirm
          </Button>
        )}
      </DialogueBoxFooter>
    </DialogueBoxContainer>
  );
};
