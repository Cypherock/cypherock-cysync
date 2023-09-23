import { BlurOverlay } from '@cypherock/cysync-ui';
import React, { FC, ReactNode } from 'react';

import { WalletConnectConnectionState, useWalletConnect } from '~/context';

import { WalletConnectDialogProvider } from './context';
import {
  WalletConnectAccountConnectedDialog,
  WalletConnectAccountSelectionDialog,
  WalletConnectPasteURIDialog,
} from './Dialogs';

const walletConnectDialogsMap: Partial<
  Record<WalletConnectConnectionState, ReactNode>
> = {
  [WalletConnectConnectionState.NOT_CONNECTED]: <WalletConnectPasteURIDialog />,
  [WalletConnectConnectionState.CONNECTING]: <WalletConnectPasteURIDialog />,
  [WalletConnectConnectionState.SELECT_ACCOUNT]: (
    <WalletConnectAccountSelectionDialog />
  ),
  [WalletConnectConnectionState.CONNECTED]: (
    <WalletConnectAccountConnectedDialog />
  ),
  [WalletConnectConnectionState.CONNECTION_ERROR]: <div>Error</div>,
};

const WalletConnect: FC = () => {
  const { connectionState } = useWalletConnect();

  return <BlurOverlay>{walletConnectDialogsMap[connectionState]}</BlurOverlay>;
};

export const WalletConnectDialog: FC = () => (
  <WalletConnectDialogProvider>
    <WalletConnect />
  </WalletConnectDialogProvider>
);
