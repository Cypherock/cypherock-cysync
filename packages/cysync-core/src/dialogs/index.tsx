import { ReactComponentLike } from 'prop-types';

import { DialogName } from '~/store';

import { AddAccountDialog } from './AddAccount';
import { GuidedFlow } from './GuidedFlow';
import { ReceiveDialog } from './Receive';
import { SendDialog } from './Send';
import { WalletActionsDialogBox } from './WalletActions';
import { WalletSyncError } from './WalletSyncError';
import { WalletConnectDialog } from './WalletConnect';

export const dialogs: Record<DialogName, ReactComponentLike> = {
  walletSyncError: WalletSyncError,
  walletActions: WalletActionsDialogBox,
  walletConnect: WalletConnectDialog,
  guidedFlow: GuidedFlow,
  addAccount: AddAccountDialog,
  sendDialog: SendDialog,
  receive: ReceiveDialog,
};
