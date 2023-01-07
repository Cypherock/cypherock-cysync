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
} from "../../styles/atoms/Headings/Heading.styled";
import { Flex } from "../../styles/atoms/Flex/Flex.styled";
import { Bullet } from "../../styles/atoms/Bullet/Bullet.styled";
4;
import { DefaultContainer } from "../../styles/atoms/Container/Container.styled";
import { Button } from "../../styles/atoms/Button/button.style";
import { Image } from "../../styles/atoms/Image/Image.style";
import walletExist from "./walletExist.png";

export const SingleTapWalletExist = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxBody>
          <Image src={walletExist} mbThree />

          <HeadingFive textHeading>Existing wallet</HeadingFive>
          <HeadingSix mbSix textMuted>
            The following wallets exist inside the X1 cards. Click confirm if
            these wallets were created by you.
          </HeadingSix>

          <DefaultContainer>
            <Flex alignCenter mbTwo>
              <Bullet />
              <HeadingSix mb0 textMuted>
                Wallet 1
              </HeadingSix>
            </Flex>

            <Flex alignCenter mbTwo>
              <Bullet />
              <HeadingSix mb0 textMuted>
                Wallet 2
              </HeadingSix>
            </Flex>

            <Flex alignCenter>
              <Bullet />
              <HeadingSix mb0 textMuted>
                Wallet 3
              </HeadingSix>
            </Flex>
          </DefaultContainer>
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button>Not created by me</Button>
          <Button primary> Confirm</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
