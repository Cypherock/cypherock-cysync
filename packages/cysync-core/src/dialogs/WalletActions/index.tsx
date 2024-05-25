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
  CloseButton,
  Image,
  createWalletGraphics,
  recoverWalletFromSeedphraseGraphics,
  transferWalletGraphics,
} from '@cypherock/cysync-ui';
import React, { FC, useState } from 'react';

import {
  openContactSupportDialog,
  openGuidedFlowDialog,
  openTransferFlowDialog,
} from '~/actions';
import {
  GuidedFlowType,
  TransferFlowType,
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
// import { keyValueStore } from '~/utils';

import { Header } from './Sections';

export const WalletActionsDialogBox: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const onClose = () => {
    dispatch(closeDialog('walletActions'));
  };

  const [selectedAction, setSelectedAction] = useState<GuidedFlowType>();
  const [selectedAction2, setSelectedAction2] = useState<TransferFlowType>();

  const switchToGuidedFlow = () => {
    if (selectedAction === undefined) return;
    dispatch(closeDialog('walletActions'));
    dispatch(openGuidedFlowDialog(selectedAction));
  };

  const switchToTransferFlow = () => {
    dispatch(closeDialog('walletActions'));
    dispatch(openTransferFlowDialog('walletTransfer'));
  };

  const handleSetSelectedAction = (action: GuidedFlowType) => {
    setSelectedAction(action);
    if (selectedAction2) {
      setSelectedAction2(undefined);
    }
  };

  const handleSetSelectedAction2 = (action: TransferFlowType) => {
    setSelectedAction2(action);
    if (selectedAction) {
      setSelectedAction(undefined);
    }
  };

  return (
    <BlurOverlay>
      <DialogBox py={2} pb={0} width="full" $height="80vh" onClose={onClose}>
        <Flex display="flex" direction="row" width="full">
          <Flex width="full" px={3} justify="flex-start">
            <HelpButton
              text={lang.strings.help}
              onClick={() => dispatch(openContactSupportDialog())}
            />
          </Flex>
          <Flex width="full" justify="flex-end" px={3}>
            <CloseButton onClick={onClose} />
          </Flex>
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
                onClick={() => handleSetSelectedAction('createWallet')}
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
                onClick={() => handleSetSelectedAction('importWallet')}
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
              <Flex
                direction="column"
                $borderWidth={1}
                $borderRadius={16}
                $borderColor={
                  selectedAction2 === 'walletTransfer' ? 'gold' : 'card'
                }
                onClick={() => handleSetSelectedAction2('walletTransfer')}
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
                  src={transferWalletGraphics}
                  alt="Transfer Wallet From Old to New Cypherock X1"
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
                        .transferWallet.title
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
              {selectedAction2 === 'walletTransfer' && (
                <BulletList
                  $fontSize={16}
                  $borderWidth={0}
                  $borderColor={undefined}
                  $bgColor={undefined}
                  color="white"
                  pt={0}
                  pb={0}
                  px="356px"
                  items={
                    lang.strings.onboarding.walletActionsDialogBox
                      .transferWallet.list
                  }
                />
              )}
            </Flex>
            {/* {keyValueStore.isNewUser && (
              <Container>
                <RecoverWallet height={100} />
                <div
                  style={{
                    width: '48vw',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    textAlign: 'left',
                    alignItems: 'flex-start',
                    padding: '0px 64px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '20px',
                      fontWeight: '400',
                      color: 'white',
                    }}
                  >
                    {
                      lang.strings.onboarding.walletActionsDialogBox.transfer
                        .title
                    }
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: '400',
                      color: '#827B77',
                    }}
                  >
                    {
                      lang.strings.onboarding.walletActionsDialogBox.transfer
                        .subtitle
                    }
                  </div>
                </div>
                <Button onClick={switchToGuidedFlow2}>Transfer</Button>
              </Container>
            )} */}
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
          {selectedAction2 === 'walletTransfer' ? (
            <Button
              variant="primary"
              disabled={
                !(selectedAction ?? selectedAction2 === 'walletTransfer')
              }
              onClick={switchToTransferFlow}
            >
              <LangDisplay text={lang.strings.buttons.continue} />
            </Button>
          ) : (
            <Button
              variant="primary"
              disabled={
                !(selectedAction ?? selectedAction2 === 'walletTransfer')
              }
              onClick={switchToGuidedFlow}
            >
              <LangDisplay text={lang.strings.buttons.continue} />
            </Button>
          )}
        </DialogBoxFooter>
      </DialogBox>
    </BlurOverlay>
  );
};
