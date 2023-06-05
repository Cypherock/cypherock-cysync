import React, { FC } from 'react';
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
  recoverWalletIcon,
  LangDisplay,
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';
import { OnboardingPageLayout } from '../OnboardingPageLayout';

const theme = getDefaultTheme();

const WalletActionsDialogBox: FC<{
  help: string;
  title: string;
  subTitle: string;
  createWallet: {
    title: string;
    button: string;
    list: Array<string>;
  };
  importWallet: {
    title: string;
    button: string;
    list: Array<string>;
  };
  footer: {
    title: string;
    subTitle: string;
    button: string;
  };
}> = ({ createWallet, footer, help, importWallet, title, subTitle }) => (
  <DialogBox width="full">
    <Container width="full" p={2} justify="flex-start">
      <Button variant="none">
        <Typography color="muted" fontSize={14}>
          <LangDisplay text={help} />
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
      p="20"
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
          <LangDisplay text={title} />
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
          <LangDisplay text={subTitle} />
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
                <LangDisplay text={createWallet.title} />
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
                  {createWallet.list.map((item, index) => (
                    <ListItem
                      key={`create-wallet-list-${index + 1}`}
                      width="full"
                    >
                      <Typography
                        variant="h6"
                        color="muted"
                        $textAlign="left"
                        mb={2}
                      >
                        {item}(
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
                    </ListItem>
                  ))}
                </ListContainer>
              </Container>
            </Flex>
          </DialogBoxBody>
          <DialogBoxFooter>
            <Button variant="primary">
              <LangDisplay text={createWallet.button} />
            </Button>
          </DialogBoxFooter>
        </DialogBox>
        <DialogBox width="full">
          <DialogBoxBody height="full">
            <Image width={45} src={importWalletIcon} alt="importWalletIcon" />
            <Flex gap={48} direction="column" height="full">
              <Typography
                $textAlign="center"
                variant="h5"
                color="heading"
                mb={1}
              >
                <LangDisplay text={importWallet.title} />
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
                  {importWallet.list.map((item, index) => (
                    <ListItem
                      key={`import-wallet-list-${index + 1}`}
                      width="full"
                    >
                      <Typography
                        variant="h6"
                        color="muted"
                        $textAlign="left"
                        mb={2}
                      >
                        {item}(
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
                    </ListItem>
                  ))}
                </ListContainer>
              </Container>
            </Flex>
          </DialogBoxBody>
          <DialogBoxFooter>
            <Button variant="primary">
              <LangDisplay text={importWallet.button} />
            </Button>
          </DialogBoxFooter>
        </DialogBox>
      </Flex>
    </DialogBoxBody>
    <DialogBoxFooter>
      <Flex
        align="center"
        gap={{ def: 16, lg: 32 }}
        px={{ def: '20', lg: '250' }}
      >
        <Image src={recoverWalletIcon} alt="recoverWallet" />
        <Flex direction="column">
          <Typography variant="h5" color="heading" mb={1}>
            <LangDisplay text={footer.title} />
          </Typography>
          <Typography
            display={{
              def: 'none',
              lg: 'block',
            }}
            variant="h5"
            color="muted"
            mb={1}
          >
            <LangDisplay text={footer.subTitle} />
          </Typography>
        </Flex>
        <Button variant="primary">
          <LangDisplay text={footer.button} />
        </Button>
      </Flex>
    </DialogBoxFooter>
  </DialogBox>
);

export const WalletActions: FC<{}> = () => {
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
      <WalletActionsDialogBox
        createWallet={
          lang.strings.onboarding.walletActionsDialogBox.createWallet
        }
        importWallet={
          lang.strings.onboarding.walletActionsDialogBox.importWallet
        }
        footer={lang.strings.onboarding.walletActionsDialogBox.footer}
        help={lang.strings.help}
        subTitle={lang.strings.onboarding.walletActionsDialogBox.subTitle}
        title={lang.strings.onboarding.walletActionsDialogBox.title}
      />
    </OnboardingPageLayout>
  );
};
