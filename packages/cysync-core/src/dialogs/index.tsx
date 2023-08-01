import { ReactComponentLike } from 'prop-types';

import { DialogName } from '~/store';

import { AddAccountDialog } from './AddAccount';
import { GuidedFlow } from './GuidedFlow';
import { ReceiveDialog } from './Receive';
import { WalletActionsDialogBox } from './WalletActions';
import { WalletSyncError } from './WalletSyncError';
import { SendGuide } from './SendGuide';

export const dialogs: Record<DialogName, ReactComponentLike> = {
  walletSyncError: WalletSyncError,
  walletActions: WalletActionsDialogBox,
  guidedFlow: GuidedFlow,
  addAccount: AddAccountDialog,
  sendGuide: SendGuide,
  receiveDialog: ReceiveDialog,
};
