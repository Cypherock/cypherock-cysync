import React, { FC, useState } from 'react';
import {
  Button,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  Image,
  LangDisplay,
  Typography,
  recoverWalletIcon,
} from '@cypherock/cysync-ui';
import { selectLanguage, useAppSelector } from '~/store';
import { OnboardingPageLayout } from '../../OnboardingPageLayout';
import { Header } from './Header';
import { CreateWalletDialogBox } from './CreateWalletDialogBox';
import { ImportWalletDialogBox } from './ImportWalletDialogBox';
import { TransferWallet } from './TransferWallet';
import { CreateNewWallet } from '../CreateNewWallet';

export const WalletActions: FC<{}> = () => {
  const lang = useAppSelector(selectLanguage);
  const [showCreateWalletDialogBox, setShowCreateWalletDialogBox] =
    useState(false);
  return (
    <OnboardingPageLayout
      $bgColor="primary"
      showBlurBackground={showCreateWalletDialogBox}
      showAside={false}
      withHelp
    >
      {showCreateWalletDialogBox ? (
        <CreateNewWallet
          setShowCreateWalletDialogBox={setShowCreateWalletDialogBox}
        />
      ) : (
        <Flex direction="column" align="center" gap={{ def: 40, md: 60 }}>
          <Header
            subTitle={lang.strings.onboarding.walletActionsDialogBox.subTitle}
            title={lang.strings.onboarding.walletActionsDialogBox.title}
          />
          <Flex gap={20} px={{ def: '20', lg: '150' }}>
            <CreateWalletDialogBox
              createWallet={
                lang.strings.onboarding.walletActionsDialogBox.createWallet
              }
              setShowCreateWalletDialogBox={setShowCreateWalletDialogBox}
            />
            <ImportWalletDialogBox
              importWallet={
                lang.strings.onboarding.walletActionsDialogBox.importWallet
              }
            />
            <DialogBox display={{ def: 'flex', lg: 'none' }} width="full">
              <DialogBoxBody height="full">
                <Image width={45} src={recoverWalletIcon} alt="recoverWallet" />
                <Flex gap={48} direction="column" height="full">
                  <Typography
                    $textAlign="center"
                    variant="h5"
                    color="heading"
                    mb={1}
                  >
                    <LangDisplay
                      text={
                        lang.strings.onboarding.walletActionsDialogBox
                          .transferWallet.title
                      }
                    />
                  </Typography>
                </Flex>
              </DialogBoxBody>
              <DialogBoxFooter>
                <Button variant="primary">
                  <LangDisplay
                    text={
                      lang.strings.onboarding.walletActionsDialogBox
                        .transferWallet.button
                    }
                  />
                </Button>
              </DialogBoxFooter>
            </DialogBox>
          </Flex>
          <TransferWallet
            transferWallet={
              lang.strings.onboarding.walletActionsDialogBox.transferWallet
            }
          />
        </Flex>
      )}
    </OnboardingPageLayout>
  );
};
