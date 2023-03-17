import {
  DialogueBoxContainer,
  DialogueBoxBody,
  DialogueBoxFooter,
  Bullet,
  Button,
  Typography,
  Container,
  Flex,
  Image,
} from "@components";
import { Link } from "react-router-dom";
import { Aside } from "./Aside";
import close from "@assets/images/close.png";
import { useState } from "react";
import addwallet from "@assets/images/add-wallet.png";
import importwallet from "@assets/images/import-wallet.png";
import recoverwallet from "@assets/images/recover-wallet.png";
import { ONBOARDING_ROUTE_TERMS_OF_USE } from "../../../routes/constantRoutePath";

export const Usage = (): JSX.Element => {
  const [popup, setPopup] = useState(false);
  return (
    <Flex gap="gap0">
      <Aside />
      <Container variant="container" bgColor="contentGratient" gap="gapTwo">
        <Flex position="absolute" top="topThree" right="rightThree">
          <Typography color="textMuted">Help</Typography>
          <Typography color="textGold">?</Typography>
        </Flex>
        <DialogueBoxContainer>
          <DialogueBoxBody>
            <Typography variant="h5" color="textHeading" mb="mbOne">
              I am using Cypherock X1 for the first time
            </Typography>
            <Typography variant="h6" color="textMuted">
              This is dialogue text or sub heading
            </Typography>
          </DialogueBoxBody>
          <DialogueBoxFooter>
            <Link to={ONBOARDING_ROUTE_TERMS_OF_USE}>
              <Button variation="primary">Button</Button>
            </Link>
          </DialogueBoxFooter>
        </DialogueBoxContainer>

        <DialogueBoxContainer>
          <DialogueBoxBody>
            <Typography variant="h5" color="textHeading" mb="mbOne">
              I have already used a Cypherock X1
            </Typography>
            <Typography variant="h6" color="textMuted">
              This is dialogue text or sub heading
            </Typography>
          </DialogueBoxBody>
          <DialogueBoxFooter>
            <Button
              variation="primary"
              onClick={() => setPopup((wasOpen) => !wasOpen)}
            >
              Button
            </Button>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Container>

      {popup ? (
      <Container position="absolute" variant="modalContainer" justify="center" align="center">
        <Flex>
          <DialogueBoxContainer>
            <DialogueBoxBody>
              <Flex align="center" justify="between">
                <Flex>
                  <Typography color="textMuted">Help</Typography>
                  <Typography color="textGold">?</Typography>
                </Flex>
                <div onClick={() => setPopup((wasOpen) => !wasOpen)}>
                  <Image src={close} />
                </div>
              </Flex>

              <Typography variant="h5" color="textHeading" mb="mbSeven">
                Let's create a wallet before we proceed. Make sure you have all
                the 4 X1 cards with you.
              </Typography>

              <Flex gap="gapTwo">
                <DialogueBoxContainer>
                  <DialogueBoxBody>
                    <Image src={addwallet} mb="mbFour" />
                    <Typography variant="h6" color="textHeading" mb="mbFive">
                      Create a new wallet
                    </Typography>
                    <Container bgColor="list" direction="column">
                      <Flex align="center" mb="mbTwo" gap="gapTwo" pb="pbEight">
                        <Bullet size="sm" />
                        <Typography
                          variant="h6"
                          color="textMuted"
                          textAlign="left"
                        >
                          If you have bought a brand new Cypherock X1 and want
                          to setup a new wallet
                        </Typography>
                      </Flex>
                    </Container>
                  </DialogueBoxBody>
                  <DialogueBoxFooter>
                    <Link to={ONBOARDING_ROUTE_TERMS_OF_USE}>
                      <Button variation="primary">Create</Button>
                    </Link>
                  </DialogueBoxFooter>
                </DialogueBoxContainer>

                <DialogueBoxContainer>
                  <DialogueBoxBody>
                    <Image src={importwallet} mb="mbFour" />
                    <Typography variant="h6" color="textHeading" mb="mbFive">
                      Import your wallet from a seed phrase
                    </Typography>

                    <Container bgColor="list" direction="column">
                      <Flex align="center" mb="mbTwo" gap="gapTwo">
                        <Bullet size="sm" />
                        <Typography
                          variant="h6"
                          color="textMuted"
                          textAlign="left"
                        >
                          You want to transfer your assets from your other
                          wallets into Cypherock X1. (?)
                        </Typography>
                      </Flex>

                      <Flex align="center" mb="mbTwo" gap="gapTwo">
                        <Bullet size="sm" />
                        <Typography
                          variant="h6"
                          color="textMuted"
                          textAlign="left"
                        >
                          You want to transfer your assets from your other
                          wallets into Cypherock X1. (?)
                        </Typography>
                      </Flex>

                      <Flex align="center" mb="mbTwo" gap="gapTwo">
                        <Bullet size="sm" />
                        <Typography
                          variant="h6"
                          color="textMuted"
                          textAlign="left"
                        >
                          You want to see all portfolio of your other wallets
                          through Cypherock X1. (?)
                        </Typography>
                      </Flex>
                    </Container>
                  </DialogueBoxBody>
                  <DialogueBoxFooter>
                    <Link to={ONBOARDING_ROUTE_TERMS_OF_USE}>
                      <Button variation="primary">Import</Button>
                    </Link>
                  </DialogueBoxFooter>
                </DialogueBoxContainer>
              </Flex>

              <Flex gap="gapTwo" align="center" mt="mtEight">
                <Image src={recoverwallet}/>
                <Flex direction="column" ml="mlTwo">
                  <Typography variant="h5" color="textHeading" textAlign="left">
                    Transfer from old to new Cypherock X1
                  </Typography>
                  <Typography variant="h6" color="textMuted" textAlign="left">
                    If you ever had a Cypherock X1 and want to migrate your
                    wallets to a new Cypherock X1. This might be required in
                    case your lost your X1 wallet
                  </Typography>
                  <Typography variant="h6" color="textMuted" textAlign="left">
                    and one or more of the X1
                    cards whatsoever, we don’t judge
                  </Typography>
                </Flex>
                <Container ml="mlTwo">
                  <Button variation="primary">Transfer</Button>
                </Container>
              </Flex>
            </DialogueBoxBody>
          </DialogueBoxContainer>
        </Flex>
      </Container>
      ) : (
        ""
      )}
    </Flex>
  );
};
