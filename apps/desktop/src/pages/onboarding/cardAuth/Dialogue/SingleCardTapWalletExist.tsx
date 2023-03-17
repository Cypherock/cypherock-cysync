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
import { Aside } from "../Aside";
import { Link } from "react-router-dom";
import walletExist from "@assets/images/onboarding/cardAuth/walletExist.png";
import { ONBOARDING_ROUTE_CARD_SUPPLY_CHAIN_ATTACK } from "../../../../routes/constantRoutePath";

export const SingleCardTapWalletExist = () => {
  return (
    <Flex gap="gap0">
      <Aside />
      <Container variant="container" bgColor="contentGratient">
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
            <Link to ={ONBOARDING_ROUTE_CARD_SUPPLY_CHAIN_ATTACK}>
              <Button variation="warning"> Not created by me </Button>
            </Link>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Container>
    </Flex>
  );
};
