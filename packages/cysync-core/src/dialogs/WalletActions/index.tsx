import {
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Flex,
  HelpButton,
  addWalletIcon,
  importWalletIcon,
  recoverWalletIcon,
  BlurOverlay,
  CloseButton,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { openCreateWalletGuideDialog } from '~/actions';
import {
  closeDialog,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { WalletActionSection, Header, TransferWallet } from './Sections';

export const WalletActionsDialogBox: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const dispatch = useAppDispatch();
  const onClose = () => {
    dispatch(closeDialog('walletActions'));
  };

  const switchToCreateWalletDialog = () => {
    dispatch(closeDialog('walletActions'));
    dispatch(openCreateWalletGuideDialog());
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
            <WalletActionSection
              icon={addWalletIcon}
              {...lang.strings.onboarding.walletActionsDialogBox.createWallet}
              onClick={switchToCreateWalletDialog}
            />
            <WalletActionSection
              icon={importWalletIcon}
              {...lang.strings.onboarding.walletActionsDialogBox.importWallet}
            />
            <WalletActionSection
              isMiniOnly
              icon={recoverWalletIcon}
              {...lang.strings.onboarding.walletActionsDialogBox.transferWallet}
            />
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
