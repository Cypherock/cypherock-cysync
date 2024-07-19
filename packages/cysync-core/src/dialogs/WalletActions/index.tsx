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
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const BulletListContainer = styled.div`
  width: 100%;
  padding: 0;

  @media (min-width: 768px) {
    padding: 0 100px;
  }

  @media (min-width: 1024px) {
    padding: 0 200px;
  }

  @media (min-width: 1440px) {
    padding: 0 285px;
  }
  @media (min-width: 1920px) {
    padding: 0 555px;
  }
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
    setSelectedAction(action);
    setHoveredAction(undefined);
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
  };

  const handleMouseLeave = () => {
    setHoveredAction(undefined);
  };

  const getDisplayedAction = () => hoveredAction ?? selectedAction;

  return (
    <BlurOverlay>
      <DialogBox py={2} pb={0} width="full" $height="72vh" onClose={onClose}>
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
            <Flex>
              <Header
                subTitle={
                  lang.strings.onboarding.walletActionsDialogBox.subTitle
                }
                title={lang.strings.onboarding.walletActionsDialogBox.title}
              />
            </Flex>
            <Flex direction="row" gap={16} justify="center" mb="8px">
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
                width={350}
                shadow="hover:popup"
                $cursor="pointer"
              >
                <HovorableDiv
                  onMouseEnter={() => handleMouseEnter('createWallet')}
                  onMouseLeave={handleMouseLeave}
                >
                  <Image
                    $height={110}
                    src={createWalletGraphics}
                    alt="Create Wallet"
                  />
                  <Flex height="60px" display="flex" justify="center">
                    <Typography
                      variant="h5"
                      $fontSize={18}
                      color="white"
                      $textAlign="center"
                      mb="8px"
                    >
                      <LangDisplay
                        text={
                          lang.strings.onboarding.walletActionsDialogBox
                            .createWallet.title
                        }
                      />
                    </Typography>
                  </Flex>
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
                width={350}
                shadow="hover:popup"
                $cursor="pointer"
              >
                <HovorableDiv
                  onMouseEnter={() => handleMouseEnter('importWallet')}
                  onMouseLeave={handleMouseLeave}
                >
                  <Image
                    $height={110}
                    src={recoverWalletFromSeedphraseGraphics}
                    alt="Recover Wallet From Seedphrase"
                  />
                  <Flex height="60px" display="flex" justify="center">
                    <Typography
                      variant="h5"
                      $fontSize={18}
                      color="white"
                      $textAlign="center"
                      mb="8px"
                    >
                      <LangDisplay
                        text={
                          lang.strings.onboarding.walletActionsDialogBox
                            .importWallet.title
                        }
                      />
                    </Typography>
                  </Flex>
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
                  width={350}
                  shadow="hover:popup"
                  $cursor="pointer"
                >
                  <HovorableDiv
                    onMouseEnter={() => handleMouseEnter('walletTransfer')}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Image
                      $height={110}
                      src={transferWalletGraphics}
                      alt="Transfer Wallet From Old to New Cypherock X1"
                    />
                    <Flex height="60px" display="flex" justify="center">
                      <Typography
                        variant="h5"
                        $fontSize={18}
                        color="white"
                        $textAlign="center"
                        mb="8px"
                      >
                        <LangDisplay
                          text={
                            lang.strings.onboarding.walletActionsDialogBox
                              .transferWallet.title
                          }
                        />
                      </Typography>
                    </Flex>
                  </HovorableDiv>
                </Flex>
              )}
            </Flex>
            <Flex pb={4} px={4}>
              {getDisplayedAction() === 'createWallet' && (
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
              {getDisplayedAction() === 'importWallet' && (
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
              {getDisplayedAction() === 'walletTransfer' && (
                <BulletListContainer>
                  <BulletList
                    $fontSize={16}
                    $borderWidth={0}
                    $borderColor={undefined}
                    $bgColor={undefined}
                    color="white"
                    p={0}
                    items={
                      lang.strings.onboarding.walletActionsDialogBox
                        .transferWallet.list
                    }
                  />
                </BulletListContainer>
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
