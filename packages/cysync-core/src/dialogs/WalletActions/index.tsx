import {
  BlurOverlay,
  BulletList,
  Button,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  HelpButton,
  LangDisplay,
  ScrollableContainer,
  Typography,
  createWalletGraphics,
  recoverWalletFromSeedphraseGraphics,
  Image,
} from '@cypherock/cysync-ui';
import React, { FC, useState } from 'react';

import { openContactSupportDialog, openGuidedFlowDialog } from '~/actions';
import {
  GuidedFlowType,
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { Header } from './Sections';

export const WalletActionsDialogBox: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const onClose = () => {
    dispatch(closeDialog('walletActions'));
  };

  const [selectedAction, setSelectedAction] = useState<GuidedFlowType>();

  const switchToGuidedFlow = () => {
    if (selectedAction === undefined) return;
    dispatch(closeDialog('walletActions'));
    dispatch(openGuidedFlowDialog(selectedAction));
  };

  return (
    <BlurOverlay>
      <DialogBox py={2} pb={0} width="full" $height="80vh" onClose={onClose}>
        <Flex width="full" px={3} justify="flex-end">
          <HelpButton
            text={lang.strings.help}
            onClick={() => dispatch(openContactSupportDialog())}
          />
        </Flex>
        <ScrollableContainer height="full">
          <DialogBoxBody
            p="20"
            grow={2}
            align="center"
            gap={32}
            direction="column"
            justify="flex-start"
            height="full"
          >
            <Header
              subTitle={lang.strings.onboarding.walletActionsDialogBox.subTitle}
              title={lang.strings.onboarding.walletActionsDialogBox.title}
            />

            <Flex direction="row" gap={16} justify="center">
              <Flex
                direction="column"
                $borderWidth={1}
                $borderRadius={16}
                $borderColor={
                  selectedAction === 'createWallet' ? 'gold' : 'card'
                }
                onClick={() => setSelectedAction('createWallet')}
                align="center"
                pt={3}
                px={3}
                pb={2}
                gap={24}
                width={400}
                shadow="hover:popup"
                $cursor="pointer"
              >
                <Image
                  $height={100}
                  src={createWalletGraphics}
                  alt="Create Wallet"
                />
                <Typography
                  variant="h5"
                  $fontSize={18}
                  color="white"
                  $textAlign="center"
                >
                  <LangDisplay
                    text={
                      lang.strings.onboarding.walletActionsDialogBox
                        .createWallet.title
                    }
                  />
                </Typography>
              </Flex>
              <Flex
                direction="column"
                $borderWidth={1}
                $borderRadius={16}
                $borderColor={
                  selectedAction === 'importWallet' ? 'gold' : 'card'
                }
                onClick={() => setSelectedAction('importWallet')}
                align="center"
                pt={3}
                px={3}
                pb={2}
                gap={24}
                width={400}
                shadow="hover:popup"
                $cursor="pointer"
              >
                <Image
                  $height={100}
                  src={recoverWalletFromSeedphraseGraphics}
                  alt="Recover Wallet From Seedphrase"
                />
                <Typography
                  variant="h5"
                  $fontSize={18}
                  color="white"
                  $textAlign="center"
                >
                  <LangDisplay
                    text={
                      lang.strings.onboarding.walletActionsDialogBox
                        .importWallet.title
                    }
                  />
                </Typography>
              </Flex>
            </Flex>
            <Flex pt={1} pb={4} px={4}>
              {selectedAction === 'createWallet' && (
                <BulletList
                  $fontSize={16}
                  $borderWidth={0}
                  $borderColor={undefined}
                  $bgColor={undefined}
                  color="white"
                  p={0}
                  items={
                    lang.strings.onboarding.walletActionsDialogBox.createWallet
                      .list
                  }
                />
              )}
              {selectedAction === 'importWallet' && (
                <BulletList
                  $fontSize={16}
                  $borderWidth={0}
                  $borderColor={undefined}
                  $bgColor={undefined}
                  color="white"
                  p={0}
                  items={
                    lang.strings.onboarding.walletActionsDialogBox.importWallet
                      .list
                  }
                />
              )}
            </Flex>
          </DialogBoxBody>
        </ScrollableContainer>
        <DialogBoxFooter
          justify="flex-end"
          mx={4}
          px={4}
          width="auto"
          $alignSelf="stretch"
        >
          <Button variant="secondary" onClick={onClose}>
            <LangDisplay text={lang.strings.buttons.close} />
          </Button>
          <Button
            variant="primary"
            disabled={!selectedAction}
            onClick={switchToGuidedFlow}
          >
            <LangDisplay text={lang.strings.buttons.continue} />
          </Button>
        </DialogBoxFooter>
      </DialogBox>
    </BlurOverlay>
  );
};
