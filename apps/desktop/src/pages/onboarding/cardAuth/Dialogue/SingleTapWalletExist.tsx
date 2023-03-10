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

import walletExist from "@/assets/images/onboarding/cardAuth/walletExist.png";

export const SingleTapWalletExist = () => {
  return (
    <DialogueBoxContainer md>
      <DialogueBoxBody>
        <Image src={walletExist} mb="mbThree" />
        <Typography variant="h5" color="textHeading">
          Existing wallet
        </Typography>
        <Typography variant="h6" mb="mbSix" color="textMuted" mt="mtTwo">
          The following wallets exist inside the X1 cards. Click confirm if
          these wallets were created by you.
        </Typography>

        <Container bgColor="list" border direction="column" gap="gapOne">
          <Flex align="center">
            <Bullet size="sm" />
            <Typography variant="h6" color="textMuted" ml="mlTwo">
              Wallet 1
            </Typography>
          </Flex>

          <Flex align="center">
            <Bullet size="sm" />
            <Typography variant="h6" color="textMuted" ml="mlTwo">
              Wallet 2
            </Typography>
          </Flex>

          <Flex align="center">
            <Bullet size="sm" />
            <Typography variant="h6" color="textMuted" ml="mlTwo">
              Wallet 3
            </Typography>
          </Flex>
        </Container>
      </DialogueBoxBody>
      <DialogueBoxFooter>
        <Button variation="warning"> Not created by me </Button>
      </DialogueBoxFooter>
    </DialogueBoxContainer>
  );
};
