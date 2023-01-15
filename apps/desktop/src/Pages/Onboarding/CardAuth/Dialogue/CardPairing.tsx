import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
  DialogueBoxTopBar,
  Image,
  HeadingFive,
  HeadingSix,
  HeadingFour,
  DefaultContainer,
  Flex,
  Bullet,
  Button,
} from "@/components/styles";

export const CardPairing = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <HeadingFive textHeading mbOne>
            Place X1 cards one by one below the X1 vault
          </HeadingFive>
          <HeadingSix textMuted mbSix>
            Do not lift until you hear 3 beep sounds
          </HeadingSix>

          <DefaultContainer list roundedOne border mbOne>
            <Flex alignCenter justifyBetween>
              <HeadingSix mb0 textMuted>
                X1 Card #1
              </HeadingSix>

              <Flex>
                <Bullet lg muted />
                <Bullet lg success />
                <Bullet lg failed />
              </Flex>
            </Flex>
          </DefaultContainer>

          <DefaultContainer list roundedOne border mbOne>
            <Flex alignCenter justifyBetween>
              <HeadingSix mb0 textMuted>
                X1 Card #1
              </HeadingSix>

              <Flex>
                <Bullet lg muted />
                <Bullet lg success />
                <Bullet lg failed />
              </Flex>
            </Flex>
          </DefaultContainer>

          <DefaultContainer list roundedOne border mbOne>
            <Flex alignCenter justifyBetween>
              <HeadingSix mb0 textMuted>
                X1 Card #1
              </HeadingSix>

              <Flex>
                <Bullet lg muted />
                <Bullet lg success />
                <Bullet lg failed />
              </Flex>
            </Flex>
          </DefaultContainer>

          <DefaultContainer list roundedOne border mbSix>
            <Flex alignCenter justifyBetween>
              <HeadingSix mb0 textMuted>
                X1 Card #1
              </HeadingSix>

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
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button variation="Secondary"> Support </Button>
          <Button variation="Primary">Retry</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
