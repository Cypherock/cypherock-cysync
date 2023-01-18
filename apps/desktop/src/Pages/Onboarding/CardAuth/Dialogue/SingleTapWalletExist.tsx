import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxTopBar,
  Image,
  HeadingFive,
  HeadingSix,
  HeadingFour,
  DefaultContainer,
  Flex,
  Bullet,
  DialogueBoxFooter,
  Button,
} from "@/cysync-ui";

import walletExist from "./walletExist.png";

export const SingleTapWalletExist = () => {
  return (
    <>
      <DialogueBoxContainer md>
        <DialogueBoxBody>
          <Image src={walletExist} mbThree />

          <HeadingFive textHeading>Existing wallet</HeadingFive>
          <HeadingSix mbSix textMuted>
            The following wallets exist inside the X1 cards. Click confirm if
            these wallets were created by you.
          </HeadingSix>

          <DefaultContainer list border>
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
        </DialogueBoxFooter>
      </DialogueBoxContainer>
    </>
  );
};
