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
  Span,
} from "@/components/styles";
import { useState } from "react";
import { DialogueTerms } from "./DialogueTerms";

export const DialogueWelcome = (): JSX.Element => {
  const [getStartedBtn, setGetStartedBtn] = useState(false);

  const clickHandler = () => {
    setGetStartedBtn((wasClicked) => !wasClicked);
  };
  return (
    <>
      {getStartedBtn ? (
        <DialogueTerms />
      ) : (
        <DialogueBoxContainer md>
          <DialogueBoxBody>
            <HeadingFive textHeading>
              Ensure the product contains the following
            </HeadingFive>
            <HeadingSix textMuted mbSix>
              Make sure the tamper-proof seal of the package was intact
            </HeadingSix>
            <DefaultContainer roundedOne list mbSix>
              <Flex justifyBetween>
                <Flex column>
                  <Flex alignCenter>
                    <Bullet gold />
                    <HeadingSix textGold mb0>
                      X1 Vault
                    </HeadingSix>
                  </Flex>

                  <Flex alignCenter>
                    <Bullet />
                    <HeadingSix textMuted mb0>
                      4 X1 Cards
                    </HeadingSix>
                  </Flex>
                </Flex>

                <Flex column>
                  <Flex alignCenter>
                    <Bullet />
                    <HeadingSix textMuted mb0>
                      4 Card Covers
                    </HeadingSix>
                  </Flex>

                  <Flex alignCenter>
                    <Bullet />
                    <HeadingSix textMuted mb0>
                      USB Cable
                    </HeadingSix>
                  </Flex>
                </Flex>
              </Flex>
            </DefaultContainer>

            <DefaultContainer roundedOne list border>
              <Flex>
                <HeadingSix textMuted>
                  Please email at <Span textHeading>support@cypherock.com</Span>{" "}
                  if your package does not contain any of these
                </HeadingSix>
              </Flex>
            </DefaultContainer>
          </DialogueBoxBody>
          <DialogueBoxFooter>
            <Button variation="Primary" onClick={clickHandler}>
              Get Started
            </Button>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      )}
    </>
  );
};
