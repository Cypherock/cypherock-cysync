import { Link } from 'react-router-dom';
import React, { ReactElement, useState } from 'react';
import {
  Bullet,
  Button,
  Container,
  DialogueBoxBody,
  DialogueBoxContainer,
  DialogueBoxFooter,
  Flex,
  Modal,
  Typography,
} from '@cypherock/cysync-ui';
import { Aside } from './Aside';

// import close from "@/assets/images/close.png";
// import addwallet from "@/assets/images/add-wallet.png";
// import importwallet from "@/assets/images/import-wallet.png";
// import recoverwallet from "@/assets/images/recover-wallet.png";

export const Usage = (): ReactElement => {
  const [popup, setPopup] = useState(false);
  return (
    <Flex gap={0}>
      <Aside />
      <Container bgColor="contentGratient" gap={2}>
        <Flex position="absolute" top={3} right={3}>
          <Typography color="muted">Help</Typography>
          <Typography color="gold">?</Typography>
        </Flex>
        <DialogueBoxContainer>
          <DialogueBoxBody>
            <Typography variant="h5" color="heading" mb={1}>
              I am using Cypherock X1 for the first time
            </Typography>
            <Typography variant="h6" color="muted">
              This is dialogue text or sub heading
            </Typography>
          </DialogueBoxBody>
          <DialogueBoxFooter>
            <Link to="/termsOfUse">
              <Button variant="primary">Button</Button>
            </Link>
          </DialogueBoxFooter>
        </DialogueBoxContainer>

        <DialogueBoxContainer>
          <DialogueBoxBody>
            <Typography variant="h5" color="heading" mb={1}>
              I have already used a Cypherock X1
            </Typography>
            <Typography variant="h6" color="muted">
              This is dialogue text or sub heading
            </Typography>
          </DialogueBoxBody>
          <DialogueBoxFooter>
            <Button
              variant="primary"
              onClick={() => setPopup(wasOpen => !wasOpen)}
            >
              Button
            </Button>
          </DialogueBoxFooter>
        </DialogueBoxContainer>
      </Container>

      {popup ? (
        <Modal position="absolute" justify="center" align="center">
          <Flex>
            <DialogueBoxContainer>
              <DialogueBoxBody>
                <Flex align="center" justify="space-between">
                  <Flex>
                    <Typography color="muted">Help</Typography>
                    <Typography color="gold">?</Typography>
                  </Flex>
                  {/* <div onClick={() => setPopup(wasOpen => !wasOpen)}>
                    <Image src={close} />
                  </div> */}
                </Flex>

                <Typography variant="h5" color="heading" mb={7}>
                  Let&apos;s create a wallet before we proceed. Make sure you
                  have all the 4 X1 cards with you.
                </Typography>

                <Flex gap={2}>
                  <DialogueBoxContainer>
                    <DialogueBoxBody>
                      {/* <Image src={addwallet} mb="mbFour" /> */}
                      <Typography variant="h6" color="heading" mb={5}>
                        Create a new wallet
                      </Typography>
                      <Container bgColor="list" direction="column">
                        <Flex align="center" mb={2} gap={2} pb={8}>
                          <Bullet size="sm" />
                          <Typography
                            variant="h6"
                            color="muted"
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
                        <Button variant="primary">Create</Button>
                      </Link>
                    </DialogueBoxFooter>
                  </DialogueBoxContainer>

                  <DialogueBoxContainer>
                    <DialogueBoxBody>
                      {/* <Image src={importwallet} mb="mbFour" /> */}
                      <Typography variant="h6" color="heading" mb={5}>
                        Import your wallet from a seed phrase
                      </Typography>

                      <Container bgColor="list" direction="column">
                        <Flex align="center" mb={2} gap={2}>
                          <Bullet size="sm" />
                          <Typography
                            variant="h6"
                            color="muted"
                            textAlign="left"
                          >
                            You want to transfer your assets from your other
                            wallets into Cypherock X1. (?)
                          </Typography>
                        </Flex>

                        <Flex align="center" mb={2} gap={2}>
                          <Bullet size="sm" />
                          <Typography
                            variant="h6"
                            color="muted"
                            textAlign="left"
                          >
                            You want to transfer your assets from your other
                            wallets into Cypherock X1. (?)
                          </Typography>
                        </Flex>

                        <Flex align="center" mb={2} gap={2}>
                          <Bullet size="sm" />
                          <Typography
                            variant="h6"
                            color="muted"
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
                        <Button variant="primary">Import</Button>
                      </Link>
                    </DialogueBoxFooter>
                  </DialogueBoxContainer>
                </Flex>

                <Flex gap={2} align="center" mt={8}>
                  {/* <Image src={recoverwallet}/> */}
                  <Flex direction="column" ml={2}>
                    <Typography variant="h5" color="heading" textAlign="left">
                      Transfer from old to new Cypherock X1
                    </Typography>
                    <Typography variant="h6" color="muted" textAlign="left">
                      If you ever had a Cypherock X1 and want to migrate your
                      wallets to a new Cypherock X1. This might be required in
                      case your lost your X1 wallet
                    </Typography>
                    <Typography variant="h6" color="muted" textAlign="left">
                      and one or more of the X1 cards whatsoever, we don’t judge
                    </Typography>
                  </Flex>
                  <Container ml={2}>
                    <Button variant="primary">Transfer</Button>
                  </Container>
                </Flex>
              </DialogueBoxBody>
            </DialogueBoxContainer>
          </Flex>
        </Modal>
      ) : (
        ''
      )}
    </Flex>
  );
};
