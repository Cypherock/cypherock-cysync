import React, { FC } from 'react';
import {
  Button,
  Container,
  DialogBox,
  DialogBoxBackground,
  DialogBoxBackgroundFooter,
  DialogBoxBackgroundHeader,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  Image,
  OnboardingLayout,
  Typography,
  addWalletIcon,
  deviceImage,
  importWalletIcon,
} from '@cypherock/cysync-ui';

export const WalletActionsDialogBox: FC<{}> = () => (
  <OnboardingLayout
    img={deviceImage}
    text="Device Authentication"
    currentState={4}
    totalState={8}
  >
    <DialogBoxBackground>
      <DialogBoxBackgroundHeader email help />
      <DialogBox width="full" position="absolute">
        <DialogBoxBackgroundHeader email help={false} />
        <DialogBoxBody
          grow={2}
          align="center"
          gap={26}
          direction="column"
          height="full"
        >
          <Flex align="center" direction="column">
            <Typography $textAlign="center" variant="h5" color="heading" mb={1}>
              Let&apos;s create a wallet before we proceed. Make sure you have
              all the 4 X1 cards with you.
            </Typography>
            <Typography
              px={4}
              $textAlign="center"
              variant="h5"
              color="muted"
              mb={1}
            >
              The following tutorials are just there to guide you on your X1
              vault. You can create a wallet even without these tutorials
              independently on your Cypherock X1
            </Typography>
          </Flex>
          <Flex gap={20}>
            <DialogBox>
              <DialogBoxBody>
                <Image width={45} src={addWalletIcon} alt="importWalletIcon" />
                <Flex gap={16} direction="column" height="full">
                  <Typography
                    $textAlign="center"
                    variant="h5"
                    color="heading"
                    mb={1}
                  >
                    Create a new wallet
                  </Typography>
                  <Container
                    height="full"
                    rounded={8}
                    $bgColor="input"
                    px={2}
                    py={3}
                    align="flex-start"
                  >
                    <Typography variant="h6" color="muted">
                      If you have bought a brand new Cypherock X1 and want to
                      setup a new wallet
                    </Typography>
                  </Container>
                </Flex>
              </DialogBoxBody>
              <DialogBoxFooter>
                <Button variant="primary">Create</Button>
              </DialogBoxFooter>
            </DialogBox>
            <DialogBox>
              <DialogBoxBody>
                <Image
                  width={45}
                  src={importWalletIcon}
                  alt="importWalletIcon"
                />
                <Flex gap={16} direction="column" height="full">
                  <Typography
                    $textAlign="center"
                    variant="h5"
                    color="heading"
                    mb={1}
                  >
                    Import your wallet from a seed phrase
                  </Typography>
                  <Container
                    height="full"
                    rounded={8}
                    $bgColor="input"
                    px={2}
                    py={3}
                    align="flex-start"
                  >
                    <Typography variant="h6" color="muted">
                      You want to use Cypherock X1 as a backup of your other
                      wallets. (?)
                    </Typography>
                  </Container>
                </Flex>
              </DialogBoxBody>
              <DialogBoxFooter>
                <Button variant="primary">Import</Button>
              </DialogBoxFooter>
            </DialogBox>
          </Flex>
        </DialogBoxBody>
      </DialogBox>
      <DialogBoxBackgroundFooter />
    </DialogBoxBackground>
  </OnboardingLayout>
);
