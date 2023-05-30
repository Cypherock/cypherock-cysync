import React, { FC, ReactNode } from 'react';
import {
  BlurOverlay,
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
  ListContainer,
  ListItem,
  OnboardingLayout,
  Typography,
  addWalletIcon,
  deviceImage,
  importWalletIcon,
} from '@cypherock/cysync-ui';

const createWalletList: Array<{ index: number; text: string | ReactNode }> = [
  {
    index: 1,
    text: (
      <Typography variant="h6" color="muted" $textAlign="left" mb={2}>
        If you have bought a brand new Cypherock X1 and want to setup a new
        wallet
      </Typography>
    ),
  },
];
const importWalletList: Array<{ index: number; text: string | ReactNode }> = [
  {
    index: 1,
    text: (
      <Flex noWrap={false}>
        <Typography variant="h6" color="muted" $textAlign="left" mb={2}>
          You want to transfer your assets from your other wallets into
          Cypherock X1. (
        </Typography>{' '}
        <Typography color="gold">?</Typography>
        <Typography variant="h6" color="muted">
          )
        </Typography>
      </Flex>
    ),
  },
  // {
  //   index: 2,
  //   text: (
  //     <Flex>
  //       <Typography variant="h6" color="muted" $textAlign="left" mb={2}>
  //         You want to transfer your assets from your other wallets into
  //         Cypherock X1.(<Typography color="gold">?</Typography>)
  //       </Typography>
  //     </Flex>
  //   ),
  // },
  // {
  //   index: 3,
  //   text: (
  //     <Flex>
  //       <Typography variant="h6" color="muted" $textAlign="left" mb={2}>
  //         You want to see all portfolio of your other wallets through Cypherock
  //         X1. (<Typography color="gold">?</Typography>)
  //       </Typography>
  //     </Flex>
  //   ),
  // },
];

const createWalletListItems = createWalletList.map(li => (
  <ListItem key={li.index} width="full">
    <Typography variant="h6" color="muted" $textAlign="left" mb={2}>
      {li.text}
    </Typography>
  </ListItem>
));

const importWalletListItems = importWalletList.map(li => (
  <ListItem key={li.index} width="full">
    <Typography variant="h6" color="muted" $textAlign="left" mb={2}>
      {li.text}
    </Typography>
  </ListItem>
));

export const WalletActionsDialogBox: FC<{}> = () => (
  <OnboardingLayout
    img={deviceImage}
    text="Device Authentication"
    currentState={4}
    totalState={8}
  >
    <DialogBoxBackground>
      <DialogBoxBackgroundHeader email help />
      <DialogBoxBackgroundFooter />
    </DialogBoxBackground>
    <BlurOverlay>
      <DialogBox width="full">
        <Container width="full" p={2} justify="flex-start">
          <Button variant="none">
            <Flex gap={8}>
              <Typography color="muted" fontSize={14}>
                Help
              </Typography>
              <Typography color="gold" fontSize={14}>
                ?
              </Typography>
            </Flex>
          </Button>
        </Container>
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
                  <Container $bgColor="list" direction="column">
                    <ListContainer p={4} direction="column" width="full">
                      {createWalletListItems}
                    </ListContainer>
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
                  <Container $bgColor="list" direction="column">
                    <ListContainer p={4} direction="column" width="full">
                      {importWalletListItems}
                    </ListContainer>
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
    </BlurOverlay>
  </OnboardingLayout>
);
