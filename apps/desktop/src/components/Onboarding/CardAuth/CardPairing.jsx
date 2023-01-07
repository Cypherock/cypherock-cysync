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

export const CardPairing = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxHeader>
          <HeadingFour textHeading mb0>
            Your X1 card will now be authenticated through Cypherock to check
            its authenticity (?)
          </HeadingFour>
        </DialogueBoxHeader>
        <DialogueBoxBody>
          <HeadingFive textSilver mbOne>
            Place X1 cards one by one below the X1 vault
          </HeadingFive>
          <HeadingSix textMuted mbSix>
            Do not lift until you hear 3 beep sounds
          </HeadingSix>

          <DefaultContainer mbSix>
            <Flex alignCenter mbTwo justifyBetween>
              <HeadingFive mb0 textMuted>
                X1 Card #1
              </HeadingFive>

              <Flex>
                <Bullet lg muted />
                <Bullet lg success />
                <Bullet lg failed />
              </Flex>
            </Flex>

            <Flex alignCenter mbTwo justifyBetween>
              <HeadingFive mb0 textMuted>
                X1 Card #2
              </HeadingFive>

              <Flex>
                <Bullet lg muted />
                <Bullet lg success />
                <Bullet lg failed />
              </Flex>
            </Flex>

            <Flex alignCenter mbTwo justifyBetween>
              <HeadingFive mb0 textMuted>
                X1 Card #3
              </HeadingFive>

              <Flex>
                <Bullet lg outline />
                <Bullet lg success />
                <Bullet lg failed />
              </Flex>
            </Flex>

            <Flex alignCenter mbTwo justifyBetween>
              <HeadingFive mb0 textMuted>
                X1 Card #4
              </HeadingFive>

              <Flex>
                <Bullet lg muted />
                <Bullet lg success />
                <Bullet lg failed />
              </Flex>
            </Flex>
          </DefaultContainer>
          <HeadingSix textError>
            Wrong card! Make sure you use your card should belong to the same
            family
          </HeadingSix>
          <HeadingSix textError>
            Auth failed: Server data missing. Retry by reconnecting the device
            first
          </HeadingSix>
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button secondary> Support </Button>
          <Button primary>Retry</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
