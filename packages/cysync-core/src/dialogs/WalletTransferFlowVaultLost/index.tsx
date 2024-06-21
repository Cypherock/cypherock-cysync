import {
  DialogBox,
  DialogBoxBody,
  WalletDialogMainContainer,
  MilestoneAside,
  CloseButton,
  BlurOverlay,
  DialogBoxBackgroundBar,
  ConfettiBlast,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';

import { WalletTransferFlowLostVaultType } from '~/store';

import {
  WalletTransferLostVaultFlowProvider,
  useWalletTransferLostVaulFlow,
} from './context';
import { CloseConfirmation } from './Dialogs';

export const WalletTransferFlowLostVaultDialog: FC = () => {
  const {
    tabs,
    currentTab,
    currentDialog,
    blastConfetti,
    showBackButton,
    title,
  } = useWalletTransferLostVaulFlow();
  const [showOnClose, setShowOnClose] = React.useState(false);

  const isFinalMessageShown =
    currentTab === tabs.length - 1 &&
    currentDialog === tabs[tabs.length - 1].dialogs.length - 1;

  return (
    <BlurOverlay>
      <DialogBox
        direction="row"
        gap={0}
        width="full"
        onClose={() => setShowOnClose(true)}
      >
        {showOnClose && <CloseConfirmation setShowOnClose={setShowOnClose} />}
        <>
          <MilestoneAside
            heading={title}
            milestones={tabs.map(t => t.name)}
            activeTab={currentTab}
            isFinalMessageShown={isFinalMessageShown}
          />
          <WalletDialogMainContainer>
            {blastConfetti && <ConfettiBlast />}
            <DialogBoxBody
              p={0}
              grow={2}
              align="center"
              gap={110}
              direction="column"
              height="full"
            >
              <DialogBox width={500}>
                <DialogBoxBody p="0" gap={0}>
                  {tabs[currentTab]?.dialogs[currentDialog]}
                </DialogBoxBody>
              </DialogBox>
            </DialogBoxBody>
            <DialogBoxBackgroundBar
              rightComponent={
                <CloseButton onClick={() => setShowOnClose(true)} />
              }
              position="top"
              useLightPadding
            />
            {showBackButton && (
              <DialogBoxBackgroundBar position="bottom" useLightPadding />
            )}
          </WalletDialogMainContainer>
        </>
      </DialogBox>
    </BlurOverlay>
  );
};

export const WalletTransferFlowLostValt: FC<{
  type: WalletTransferFlowLostVaultType;
}> = ({ type }) => (
  <WalletTransferLostVaultFlowProvider type={type}>
    <WalletTransferFlowLostVaultDialog />
  </WalletTransferLostVaultFlowProvider>
);
