import {
  BlurOverlay,
  Button,
  CloseButton,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  HelpButton,
  Image,
  LangDisplay,
  Typography,
  recoverWalletIcon,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { CreateWalletDialogBox } from './CreateWalletDialogBox';
import { Header } from './Header';
import { ImportWalletDialogBox } from './ImportWalletDialogBox';
import { TransferWallet } from './TransferWallet';

export const WalletActionsDialogBox: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const onClose = () => {
    dispatch(closeDialog('walletActions'));
  };

  return (
    <BlurOverlay>
      <DialogBox py={2} width="full">
        <Flex width="full" height="full" px={3} justify="space-between">
          <HelpButton text={lang.strings.help} />
          <CloseButton onClick={onClose} />
        </Flex>
        <DialogBoxBody
          p="20"
          grow={2}
          align="center"
          gap={40}
          direction="column"
          height="full"
        >
          <Header
            subTitle={lang.strings.onboarding.walletActionsDialogBox.subTitle}
            title={lang.strings.onboarding.walletActionsDialogBox.title}
          />

          <Flex gap={20} px={{ def: '20', lg: '150' }}>
            <CreateWalletDialogBox
              createWallet={
                lang.strings.onboarding.walletActionsDialogBox.createWallet
              }
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
        </DialogBoxBody>
        <DialogBoxFooter>
          <TransferWallet
            transferWallet={
              lang.strings.onboarding.walletActionsDialogBox.transferWallet
            }
          />
        </DialogBoxFooter>
      </DialogBox>
    </BlurOverlay>
  );
};
