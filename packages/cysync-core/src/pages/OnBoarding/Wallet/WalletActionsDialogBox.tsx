import React, { FC, ReactNode } from 'react';
import {
  Button,
  Container,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  Image,
  ListContainer,
  ListItem,
  LogoOutlinedAsideImage,
  Typography,
  addWalletIcon,
  importWalletIcon,
  getDefaultTheme,
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';
import { OnboardingPageLayout } from '../OnboardingPageLayout';

const theme = getDefaultTheme();

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
      <Typography variant="h6" color="muted" $textAlign="left" mb={2}>
        You want to transfer your assets from your other wallets into Cypherock
        X1. (
        <span
          style={{
            background: theme.palette.golden,
            WebkitTextFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
          }}
        >
          ?
        </span>
        )
      </Typography>
    ),
  },
  {
    index: 2,
    text: (
      <Typography variant="h6" color="muted" $textAlign="left" mb={2}>
        You want to transfer your assets from your other wallets into Cypherock
        X1.(
        <span
          style={{
            background: theme.palette.golden,
            WebkitTextFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
          }}
        >
          ?
        </span>
        )
      </Typography>
    ),
  },
  {
    index: 3,
    text: (
      <Typography variant="h6" color="muted" $textAlign="left" mb={2}>
        You want to see all portfolio of your other wallets through Cypherock
        X1. (
        <span
          style={{
            background: theme.palette.golden,
            WebkitTextFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
          }}
        >
          ?
        </span>
        )
      </Typography>
    ),
  },
];

const createWalletListItems = createWalletList.map(li => (
  <ListItem key={li.index} width="full">
    {li.text}
  </ListItem>
));

const importWalletListItems = importWalletList.map(li => (
  <ListItem key={li.index} width="full">
    {li.text}
  </ListItem>
));

export const WalletActionsDialogBox: FC<{}> = () => {
  const lang = useAppSelector(selectLanguage);
  return (
    <OnboardingPageLayout
      img={LogoOutlinedAsideImage}
      text={lang.strings.onboarding.deviceDetection.heading}
      currentState={3}
      isDialogOpen
      totalState={8}
      withHelp
      withBack
    >
      <DialogBox width="full" pb={{ def: '60', lg: '102.5' }}>
        <Container width="full" p={2} justify="flex-start">
          <Button variant="none">
            <Typography color="muted" fontSize={14}>
              Help
              <span
                style={{
                  background: theme.palette.golden,
                  WebkitTextFillColor: 'transparent',
                  WebkitBackgroundClip: 'text',
                }}
              >
                ?
              </span>
            </Typography>
          </Button>
        </Container>
        <DialogBoxBody
          p={{ def: '20', lg: '40' }}
          grow={2}
          align="center"
          gap={110}
          direction="column"
          height="full"
        >
          <Flex align="center" direction="column">
            <Typography
              width={{
                def: 582,
                lg: 1141,
              }}
              $textAlign="center"
              fontSize={{
                def: 20,
                lg: 24,
              }}
              variant="h4"
              color="heading"
              mb={1}
            >
              Let&apos;s create a wallet before we proceed. Make sure you have
              all the 4 X1 cards with you.
            </Typography>
            <Typography
              display={{
                def: 'none',
                lg: 'block',
              }}
              width={964}
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
          <Flex gap={20} px={{ def: '40', lg: '150' }}>
            <DialogBox width="full">
              <DialogBoxBody height="full">
                <Image width={45} src={addWalletIcon} alt="importWalletIcon" />
                <Flex gap={48} direction="column" height="full">
                  <Typography
                    $textAlign="center"
                    variant="h5"
                    color="heading"
                    mb={1}
                  >
                    Create a new wallet
                  </Typography>
                  <Container
                    display={{
                      def: 'none',
                      lg: 'flex',
                    }}
                    justify="flex-start"
                    height="full"
                    $bgColor="list"
                    direction="column"
                  >
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
            <DialogBox width="full">
              <DialogBoxBody height="full">
                <Image
                  width={45}
                  src={importWalletIcon}
                  alt="importWalletIcon"
                />
                <Flex gap={48} direction="column" height="full">
                  <Typography
                    $textAlign="center"
                    variant="h5"
                    color="heading"
                    mb={1}
                  >
                    Import your wallet from a seed phrase
                  </Typography>
                  <Container
                    display={{
                      def: 'none',
                      lg: 'flex',
                    }}
                    justify="flex-start"
                    height="full"
                    $bgColor="list"
                    direction="column"
                  >
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
    </OnboardingPageLayout>
  );
};
