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
} from "@/component";
import { Link } from "react-router-dom";
import { Aside } from "./Aside";
import close from "@/assets/images/close.png";
import { useState } from "react";

export const Usage = (): JSX.Element => {
  const [popup, setPopup] = useState(false);
  return (
    <Flex gap0>
      <Aside />
      <Container variant="container" bgColor="contentGratient" gapTwo>
        <DialogueBoxContainer>
          <DialogueBoxBody>
            <Typography variant="h5" color="textHeading">
              I am using Cypherock X1 for the first time
            </Typography>
            <Typography variant="h6" color="textMuted">
              I am using Cypherock X1 for the first time
            </Typography>
          </DialogueBoxBody>
          <DialogueBoxFooter>
            <Link to="/termsOfUse">
              <Button variation="primary">Button</Button>
            </Link>
          </DialogueBoxFooter>
        </DialogueBoxContainer>

        <DialogueBoxContainer>
          <DialogueBoxBody>
            <Typography variant="h5" color="textHeading">
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
        <Flex position="absolute">
          <DialogueBoxContainer>
            <DialogueBoxBody>
              <Flex alignCenter justifyBetween>
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

              <Flex gapTwo>
                <DialogueBoxContainer>
                  <DialogueBoxBody>
                    <Typography variant="h6" color="textHeading" mb="mbFive">
                      Create a new wallet
                    </Typography>
                    <Container bgColor="list" column>
                      <Flex alignCenter mb="mbTwo" gapTwo>
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
                    <Link to="/termsOfUse">
                      <Button variation="primary">Create</Button>
                    </Link>
                  </DialogueBoxFooter>
                </DialogueBoxContainer>

                <DialogueBoxContainer>
                  <DialogueBoxBody>
                    <Typography variant="h6" color="textHeading" mb="mbFive">
                      Import your wallet from a seed phrase
                    </Typography>

                    <Container bgColor="list" column>
                      <Flex alignCenter mb="mbTwo" gapTwo>
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

                      <Flex alignCenter mb="mbTwo" gapTwo>
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

                      <Flex alignCenter mb="mbTwo" gapTwo>
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
                    <Link to="/termsOfUse">
                      <Button variation="primary">Import</Button>
                    </Link>
                  </DialogueBoxFooter>
                </DialogueBoxContainer>
              </Flex>

              <Flex gapTwo alignCenter>
                <Flex column>
                  <Typography variant="h5" color="textHeading" textAlign="left">
                    Transfer from old to new Cypherock X1
                  </Typography>
                  <Typography variant="h6" color="textMuted" textAlign="left">
                    If you ever had a Cypherock X1 and want to migrate your
                    wallets to a new Cypherock X1. This might be required in
                    case your lost your X1 wallet and one or more of the X1
                    cards whatsoever, we don’t judge
                  </Typography>
                </Flex>
                <Button variation="primary">Transfer</Button>
              </Flex>
            </DialogueBoxBody>
          </DialogueBoxContainer>
        </Flex>
      ) : (
        ""
      )}
    </Flex>
  );
};
