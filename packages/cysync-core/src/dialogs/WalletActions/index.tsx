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

import {
  openContactSupportDialog,
  openGuidedFlowDialog,
  openTroubleShootDialog,
} from '~/actions';
import {
  GuidedFlowType,
  TroubleShootType,
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

  const [selectedTroubleShootAction, setSelectedTroubleShootAction] =
    useState<TroubleShootType>();
  const [selectedGuidedFlowAction, setSelectedGuidedFlowAction] =
    useState<GuidedFlowType>();

  const switchToGuidedFlow = () => {
    dispatch(closeDialog('walletActions'));
    if (selectedGuidedFlowAction !== undefined) {
      dispatch(openGuidedFlowDialog(selectedGuidedFlowAction));
    }
    if (selectedTroubleShootAction !== undefined) {
      dispatch(openTroubleShootDialog(selectedTroubleShootAction));
    }
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
              {/* Create Wallet (GuidedFlowAction) */}
              <Flex
                direction="column"
                $borderWidth={1}
                $borderRadius={16}
                $borderColor={
                  selectedGuidedFlowAction === 'createWallet' ? 'gold' : 'card'
                }
                onClick={() => {
                  setSelectedGuidedFlowAction('createWallet');
                  setSelectedTroubleShootAction(undefined);
                }}
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
              {/* Import Wallet (GuidedFlowAction) */}
              <Flex
                direction="column"
                $borderWidth={1}
                $borderRadius={16}
                $borderColor={
                  selectedGuidedFlowAction === 'importWallet' ? 'gold' : 'card'
                }
                onClick={() => {
                  setSelectedGuidedFlowAction('importWallet');
                  setSelectedTroubleShootAction(undefined);
                }}
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
              {/* Diagnostics (TroubleShootAction) */}
              <Flex
                direction="column"
                $borderWidth={1}
                $borderRadius={16}
                $borderColor={
                  selectedTroubleShootAction === 'diagnostics' ? 'gold' : 'card'
                }
                onClick={() => {
                  setSelectedTroubleShootAction('diagnostics');
                  setSelectedGuidedFlowAction(undefined);
                }}
                align="center"
                pt={3}
                px={3}
                pb={2}
                gap={24}
                width={400}
                shadow="hover:popup"
                $cursor="pointer"
              >
                <Typography
                  variant="h5"
                  $fontSize={18}
                  color="white"
                  $textAlign="center"
                >
                  <LangDisplay
                    text={
                      lang.strings.onboarding.walletActionsDialogBox.diagnostics
                        .title
                    }
                  />
                </Typography>
              </Flex>
            </Flex>
            <Flex pt={1} pb={4} px={4}>
              {selectedGuidedFlowAction === 'createWallet' && (
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
              {selectedGuidedFlowAction === 'importWallet' && (
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
              {selectedTroubleShootAction === 'diagnostics' && (
                <BulletList
                  $fontSize={16}
                  $borderWidth={0}
                  $borderColor={undefined}
                  $bgColor={undefined}
                  color="white"
                  p={0}
                  items={
                    lang.strings.onboarding.walletActionsDialogBox.diagnostics
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
            disabled={!selectedGuidedFlowAction && !selectedTroubleShootAction}
            onClick={switchToGuidedFlow}
          >
            <LangDisplay text={lang.strings.buttons.continue} />
          </Button>
        </DialogBoxFooter>
      </DialogBox>
    </BlurOverlay>
  );
};
