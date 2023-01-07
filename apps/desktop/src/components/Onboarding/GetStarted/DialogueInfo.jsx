import {
  DialogueBoxContainer,
  DialogueBoxBody,
} from "../../styles/molecules/DialogueBox/DialogueBox.styled";
import {
  HeadingFive,
  HeadingSix,
} from "../../styles/atoms/Headings/Heading.styled";
import { Button } from "../../styles/atoms/Button/button.style";
import { DefaultContainer } from "../../styles/atoms/Container/Container.styled";
import { Bullet } from "../../styles/atoms/Bullet/Bullet.styled";
import { Flex } from "../../styles/atoms/Flex/Flex.styled";
export const DialogueInfo = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxBody>
          <HeadingFive textHeading mbSix>
            Ensure the following before you continue
          </HeadingFive>
          <DefaultContainer>
            <Flex alignCenter mbTwo>
              <Bullet />
              <HeadingSix textMuted mb0>
                You are present in a safe and secure environment
              </HeadingSix>
            </Flex>

            <Flex alignCenter mbTwo>
              <Bullet />
              <HeadingSix textMuted mb0>
                You have atleast 15-30 minutes to setup your wallet
              </HeadingSix>
            </Flex>

            <Flex alignCenter mbTwo>
              <Bullet />
              <HeadingSix textMuted mb0>
                You have an active internet connection
              </HeadingSix>
            </Flex>

            <Flex alignCenter>
              <Bullet />
              <HeadingSix textMuted mb0>
                The tamper-proof seal of the package is intact
              </HeadingSix>
            </Flex>
          </DefaultContainer>
        </DialogueBoxBody>
      </DialogueBoxContainer>
    </>
  );
};
