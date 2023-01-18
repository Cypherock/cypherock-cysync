import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
  Bullet,
  Button,
  HeadingFive,
  HeadingSix,
  DefaultContainer,
  Flex,
} from "@/cysync-ui";
import { useState } from "react";
import { DialogueWelcome } from "./DialogueWelcome";

export const DialogueInfo = (): JSX.Element => {
  const [continueBtn, setContinueBtn] = useState(false);

  const clickHandler = () => {
    setContinueBtn((wasClicked) => !wasClicked);
  };

  return (
    <>
      {continueBtn ? (
        <DialogueWelcome />
      ) : (
        <DialogueBoxContainer lg>
          <DialogueBoxBody>
            <HeadingFive textHeading mbSix>
              Ensure the following before you continue
            </HeadingFive>

            <DefaultContainer list>
              <Flex alignCenter mbTwo>
                <Bullet />
                <HeadingSix textMuted mb0 textLeft>
                  You are present in a safe and secure environment
                </HeadingSix>
              </Flex>
              <Flex alignCenter mbTwo>
                <Bullet />
                <HeadingSix textMuted mb0 textLeft>
                  You have atleast 15-30 minutes to setup your wallet
                </HeadingSix>
              </Flex>
              <Flex alignCenter mbTwo>
                <Bullet />
                <HeadingSix textMuted mb0 textLeft>
                  You have an active internet connection
                </HeadingSix>
              </Flex>
              <Flex alignCenter mbTwo>
                <Bullet />
                <HeadingSix textMuted mb0 textLeft>
                  The tamper-proof seal of the package is intact
                </HeadingSix>
              </Flex>
              <Flex alignCenter mbTwo>
                <Bullet />
                <HeadingSix textMuted mb0 textLeft>
                  Cypherock will never ask you for your seed phrase nor will it
                  ever ask you to sign a transaction
                </HeadingSix>
              </Flex>
              <Flex alignCenter mbTwo>
                <Bullet />
                <HeadingSix textMuted mb0 textLeft>
                  Cypherock will only email you from cypherock.com. Do not trust
                  any email from any other website domain
                </HeadingSix>
              </Flex>
            </DefaultContainer>
          </DialogueBoxBody>
          <DialogueBoxFooter>
            <Button variation="Primary" onClick={clickHandler}>
              Continue
            </Button>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      )}
    </>
  );
};
