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
import error from "./error.png";

export const SupplyChainAttack = () => {
  return (
    <>
      <DialogueBoxContainer>
        <DialogueBoxHeader>
          <HeadingSix textMuted mb0>
            Card Authentication
          </HeadingSix>
        </DialogueBoxHeader>
        <DialogueBoxBody>
          <Image src={error} mbThree />

          <HeadingFive textHeading>Supply chain attack</HeadingFive>
          <HeadingSix textMuted>
            Your Cypherock X1 might have been compromised. Contact Cypherock
            support immediately. Close the app after you have contacted the
            support
          </HeadingSix>
        </DialogueBoxBody>
        <DialogueBoxFooter>
          <Button primary> Contact Support</Button>
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
