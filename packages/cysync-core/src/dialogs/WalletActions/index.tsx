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
import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  openContactSupportDialog,
  openGuidedFlowDialog,
  openWalletTransferFlowDialog,
} from '~/actions';
import {
  GuidedFlowType,
  WalletTransferFlowType,
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { keyValueStore } from '~/utils';

import { Header } from './Sections';

const HovorableDiv = styled.div`
  padding: 8px 42px 8px 42px;
  height: 100%;
  width: 100%;
`;

export const WalletActionsDialogBox: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const onClose = () => {
    dispatch(closeDialog('walletActions'));
  };

  const [selectedAction, setSelectedAction] = useState<
    GuidedFlowType | WalletTransferFlowType | undefined
  >(undefined);
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null);
  const [hoveredAction, setHoveredAction] = useState<
    GuidedFlowType | WalletTransferFlowType | undefined
  >(undefined);

  const switchToGuidedFlow = () => {
    if (selectedAction === undefined || selectedAction === 'walletTransfer')
      return;
    dispatch(closeDialog('walletActions'));
    dispatch(openGuidedFlowDialog(selectedAction as GuidedFlowType));
  };

  const switchToTransferFlow = () => {
    dispatch(closeDialog('walletActions'));
    dispatch(openWalletTransferFlowDialog('walletTransfer'));
  };

  const handleSetSelectedAction = (
    action: GuidedFlowType | WalletTransferFlowType,
  ) => {
    if (String(selectedAction) !== hoveredAction) {
      setHoveredAction(undefined);
    }
    setSelectedAction(action);
  };

  useEffect(() => {
    const fetchIsNewUser = async () => {
      const value = await keyValueStore.isNewUser.get();
      setIsNewUser(value);
    };
    fetchIsNewUser();
  }, []);

  const handleMouseEnter = (
    action: GuidedFlowType | WalletTransferFlowType,
  ) => {
    setHoveredAction(action);
    if (String(selectedAction) !== String(action)) {
      setSelectedAction(undefined);
    }
  };

  const handleMouseLeave = (
    action: GuidedFlowType | WalletTransferFlowType,
  ) => {
    if (String(selectedAction) !== String(action)) {
      setHoveredAction(undefined);
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
            <Flex direction="row" gap={16} justify="center" mt="64px" mb="24px">
              <Flex
                direction="column"
                $borderWidth={1}
                $borderRadius={16}
                $borderColor={
                  selectedAction === 'createWallet' ? 'gold' : 'card'
                }
                onClick={() => handleSetSelectedAction('createWallet')}
                align="center"
                gap={24}
                width={400}
                shadow="hover:popup"
                $cursor="pointer"
              >
                <HovorableDiv
                  onMouseEnter={() => handleMouseEnter('createWallet')}
                  onMouseLeave={() => handleMouseLeave('createWallet')}
                >
                  <Image
                    $height={100}
                    src={createWalletGraphics}
                    alt="Create Wallet"
                    mt="32px"
                  />
                  <Typography
                    variant="h5"
                    $fontSize={18}
                    color="white"
                    $textAlign="center"
                    mt="40px"
                    mb="16px"
                  >
                    <LangDisplay
                      text={
                        lang.strings.onboarding.walletActionsDialogBox
                          .createWallet.title
                      }
                    />
                  </Typography>
                </HovorableDiv>
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
                gap={24}
                width={400}
                shadow="hover:popup"
                $cursor="pointer"
              >
                <HovorableDiv
                  onMouseEnter={() => handleMouseEnter('importWallet')}
                  onMouseLeave={() => handleMouseLeave('importWallet')}
                >
                  <Image
                    $height={100}
                    src={recoverWalletFromSeedphraseGraphics}
                    alt="Recover Wallet From Seedphrase"
                    mt="32px"
                  />
                  <Typography
                    variant="h5"
                    $fontSize={18}
                    color="white"
                    $textAlign="center"
                    mt="40px"
                    mb="16px"
                  >
                    <LangDisplay
                      text={
                        lang.strings.onboarding.walletActionsDialogBox
                          .importWallet.title
                      }
                    />
                  </Typography>
                </HovorableDiv>
              </Flex>
              {isNewUser && (
                <Flex
                  direction="column"
                  $borderWidth={1}
                  $borderRadius={16}
                  $borderColor={
                    selectedAction === 'walletTransfer' ? 'gold' : 'card'
                  }
                  onClick={() => handleSetSelectedAction('walletTransfer')}
                  align="center"
                  gap={24}
                  width={400}
                  shadow="hover:popup"
                  $cursor="pointer"
                >
                  <HovorableDiv
                    onMouseEnter={() => handleMouseEnter('walletTransfer')}
                    onMouseLeave={() => handleMouseLeave('walletTransfer')}
                  >
                    <Image
                      $height={100}
                      src={transferWalletGraphics}
                      alt="Transfer Wallet From Old to New Cypherock X1"
                      mt="32px"
                    />
                    <Typography
                      variant="h5"
                      $fontSize={18}
                      color="white"
                      $textAlign="center"
                      mt="40px"
                      mb="16px"
                    >
                      <LangDisplay
                        text={
                          lang.strings.onboarding.walletActionsDialogBox
                            .transferWallet.title
                        }
                      />
                    </Typography>
                  </HovorableDiv>
                </Flex>
              )}
            </Flex>
            <Flex pt={1} pb={4} px={4}>
              {(selectedAction === 'createWallet' ||
                hoveredAction === 'createWallet') && (
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
              {(selectedAction === 'importWallet' ||
                hoveredAction === 'importWallet') && (
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
              {(selectedAction === 'walletTransfer' ||
                hoveredAction === 'walletTransfer') && (
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
          {selectedAction === 'walletTransfer' ? (
            <Button
              variant="primary"
              disabled={
                !(selectedAction ?? selectedAction === 'walletTransfer')
              }
              onClick={switchToTransferFlow}
            >
              <LangDisplay text={lang.strings.buttons.continue} />
            </Button>
          ) : (
            <Button
              variant="primary"
              disabled={
                !(selectedAction ?? selectedAction === 'walletTransfer')
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
