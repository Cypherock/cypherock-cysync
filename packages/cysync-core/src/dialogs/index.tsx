import { ReactComponentLike } from 'prop-types';

import { DialogName } from '~/store';

import { AddAccountDialog } from './AddAccount';
import { GuidedFlow } from './GuidedFlow';
import { HistoryDialog } from './HistoryDialog';
import { ReceiveDialog } from './Receive';
import { SendDialog } from './Send';
import { WalletActionsDialogBox } from './WalletActions';
import { WalletSyncError } from './WalletSyncError';

export const dialogs: Record<DialogName, ReactComponentLike> = {
  walletSyncError: WalletSyncError,
  walletActions: WalletActionsDialogBox,
  guidedFlow: GuidedFlow,
  addAccount: AddAccountDialog,
  sendDialog: SendDialog,
  historyDialog: HistoryDialog,
  receive: ReceiveDialog,
};
