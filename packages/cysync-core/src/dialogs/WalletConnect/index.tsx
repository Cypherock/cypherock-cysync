import { BlurOverlay } from '@cypherock/cysync-ui';
import { DialogBox } from '@cypherock/cysync-ui/src';
import React, { FC } from 'react';
import { WalletConnectDialogProvider, useWalletConnectDialog } from './context';

const WalletConnect: FC = () => {
  const { currentDialog, tabs, currentTab } = useWalletConnectDialog();

  return (
    <BlurOverlay>
      <DialogBox direction="row" gap={0} align="center">
        {tabs[currentTab]?.dialogs[currentDialog]}
      </DialogBox>
    </BlurOverlay>
  );
};

export const WalletConnectDialog: FC = () => (
  <WalletConnectDialogProvider>
    <WalletConnect />
  </WalletConnectDialogProvider>
);
