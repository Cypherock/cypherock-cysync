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
  Container,
  AddWalletNewUser,
  ImportWalletNewUser,
  RecoverWallet,
  CloseButton,
} from '@cypherock/cysync-ui';
import React, { FC, useState } from 'react';

import {
  openContactSupportDialog,
  openGuidedFlowDialog,
  openTransferFlowDialog,
} from '~/actions';
import {
  GuidedFlowType,
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';
import { keyValueStore } from '~/utils';

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

  const switchToGuidedFlow2 = () => {
    dispatch(closeDialog('walletActions'));
    dispatch(openTransferFlowDialog('walletTransfer'));
  };

  const newWalletBulletList = [
    'If you have brought a brand new Cypherock X1 and want to setup a new wallet',
  ];

  const ImportWalletBulletList = [
    'You want to use Cypherock X1 as a backup of your other wallets',
    'You want to transfer your assets from your other wallets into Cypherock X1 ',
    'You want to see all portfolio of your other wallets through Cypherock X1 ',
  ];

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
              subTitle=""
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
                width={600}
                shadow="hover:popup"
                $cursor="pointer"
              >
                <AddWalletNewUser height={100} />
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
                <div style={{ height: '250px' }}>
                  <BulletList items={newWalletBulletList} />
                </div>
                <Button onClick={() => setSelectedAction('createWallet')}>
                  Create
                </Button>
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
                width={600}
                shadow="hover:popup"
                $cursor="pointer"
              >
                <ImportWalletNewUser height={100} />
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
                <div style={{ height: '250px' }}>
                  <BulletList items={ImportWalletBulletList} />
                </div>
                <Button onClick={() => setSelectedAction('importWallet')}>
                  Import
                </Button>
              </Flex>
            </Flex>
            {/* <Flex pt={1} pb={4} px={4}>
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
            </Flex> */}
            {keyValueStore.isNewUser && (
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
            )}
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
