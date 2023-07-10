import {
  Flex,
  GuidedFlowDialogBox,
  redDisconnectedIcon,
  Button,
  BlurOverlay,
  DialogBox,
  DialogBoxBody,
  Typography,
  LangDisplay,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { useCreateNewWallet } from '~/context/createNewWallet';
import { selectLanguage, useAppSelector } from '~/store';

const Buttons: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const {
    setCurrentTab: setTab,
    setCurrentDialog: setDialogBox,
    setShowCreateWalletDialogBox,
    setShowWalletActionsDialogBox,
  } = useCreateNewWallet();
  return (
    <Flex gap={16} $zIndex={1}>
      <Button variant="secondary">
        <Typography color="gold">
          <LangDisplay
            text={
              lang.strings.onboarding.createWallet.finalMessage
                .walletNotCreatedDialog.buttons.later
            }
          />
        </Typography>
      </Button>
      <Button
        onClick={() => {
          setShowCreateWalletDialogBox(false);
          setShowWalletActionsDialogBox(true);
          setTab(0);
          setDialogBox(0);
        }}
        variant="primary"
      >
        <Typography color="black">
          <LangDisplay
            text={
              lang.strings.onboarding.createWallet.finalMessage
                .walletNotCreatedDialog.buttons.createWallet
            }
          />
        </Typography>
      </Button>
    </Flex>
  );
};

export const WalletNotCreatedDialog: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onNext, onPrevious } = useCreateNewWallet();
  return (
    <BlurOverlay>
      <DialogBox width={500}>
        <DialogBoxBody p="0" pt={2}>
          <GuidedFlowDialogBox
            image={redDisconnectedIcon}
            onNext={onNext}
            onPrevious={onPrevious}
            title={
              lang.strings.onboarding.createWallet.finalMessage
                .walletNotCreatedDialog.title
            }
            subTitle={
              lang.strings.onboarding.createWallet.finalMessage
                .walletNotCreatedDialog.subTitle
            }
            footer={<Buttons />}
          />
        </DialogBoxBody>
      </DialogBox>
    </BlurOverlay>
  );
};
