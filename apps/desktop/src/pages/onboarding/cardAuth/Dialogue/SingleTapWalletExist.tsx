import { useState } from "react";
import {
  DialogueBoxContainer,
  DialogueBoxBody,
  Image,
  Container,
  Flex,
  Bullet,
  DialogueBoxFooter,
  Button,
  Typography,
} from "@components";

import walletExist from "./walletExist.png";

export const SingleTapWalletExist = () => {
  return (
    <DialogueBoxContainer md>
      <DialogueBoxBody>
        <Image src={walletExist} mb="mbThree" />
        <Typography variant="h5" color="textHeading">
          Existing wallet
        </Typography>
        <Typography variant="h6" mb="mbSix" color="textMuted">
          The following wallets exist inside the X1 cards. Click confirm if
          these wallets were created by you.
        </Typography>

        <Container bgColor="list" border>
          <Flex alignCenter mb="mbTwo">
            <Bullet />
            <Typography variant="h6" color="textMuted">
              Wallet 1
            </Typography>
          </Flex>

          <Flex alignCenter mb="mbTwo">
            <Bullet />

            <Typography variant="h6" color="textMuted">
              Wallet 1
            </Typography>
          </Flex>

          <Flex alignCenter>
            <Bullet />

            <Typography variant="h6" color="textMuted">
              Wallet 1
            </Typography>
          </Flex>
        </Container>
      </DialogueBoxBody>
      <DialogueBoxFooter>
        <Button>Not created by me</Button>
      </DialogueBoxFooter>
    </DialogueBoxContainer>
  );
};
