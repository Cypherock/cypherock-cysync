import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
} from "../../styles/molecules/DialogueBox/DialogueBox.styled";
import {
  HeadingFive,
  HeadingFour,
  HeadingSix,
} from "../../styles/atoms/Headings/Heading.styled";
import { Button } from "../../styles/atoms/Button/button.style";
import { DefaultContainer } from "../../styles/atoms/Container/Container.styled";
import { Bullet } from "../../styles/atoms/Bullet/Bullet.styled";
import { Flex } from "../../styles/atoms/Flex/Flex.styled";
export const DialogueWelcome = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxBody>
          <HeadingFive textHeading>
            Ensure the product contains the following
          </HeadingFive>
          <HeadingSix textMuted mbSix>
            Make sure the tamper-proof seal of the package was intact
          </HeadingSix>
          <DefaultContainer borderRadiusOne mbSix>
            <Flex justifyBetween row>
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

          <DefaultContainer borderRadiusOne>
            <HeadingFive textMuted>
              Please email at support@cypherock.com if your package does not
              contain any of these
            </HeadingFive>
          </DefaultContainer>
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button primary>Get Started</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
