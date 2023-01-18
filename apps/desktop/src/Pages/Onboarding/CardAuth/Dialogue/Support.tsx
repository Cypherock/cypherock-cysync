import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxTopBar,
  Image,
  HeadingFive,
  HeadingSmallest,
  HeadingSix,
  InputContainer,
  Input,
  InputLabel,
  Flex,
  SquareCheckBox,
  Bullet,
  DialogueBoxFooter,
  Button,
  Divider,
} from "@/cysync-ui";
import exiting from "./exiting.png";

export const Support = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxTopBar>
          <HeadingSix textMuted mb0>
            Contact us
          </HeadingSix>
        </DialogueBoxTopBar>
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
                <input type="checkbox" />
              </div>
            </SquareCheckBox>
            <HeadingSmallest textMuted mb0>
              Attach Application Logs
            </HeadingSmallest>
          </Flex>

          <Flex alignCenter mbTwo>
            <SquareCheckBox>
              <div>
                <input type="checkbox" />
              </div>
            </SquareCheckBox>
            <HeadingSmallest textMuted mb0>
              Attach Device Logs
            </HeadingSmallest>
          </Flex>
          <Divider mbThree />

          <HeadingSix textError mbEight textLeft>
            Your Password is incorrect
          </HeadingSix>
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button variation="Secondary"> Cancel </Button>
          <Button variation="Primary">Submit & Close app</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
