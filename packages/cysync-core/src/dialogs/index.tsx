import { ReactComponentLike } from 'prop-types';

import { DialogName } from '~/store';

import { AddAccountDialog } from './AddAccountGuide';
import { CreateWalletGuide } from './CreateWalletGuide';
import { ReceiveDialog } from './Receive';
import { WalletActionsDialogBox } from './WalletActions';
import { WalletSyncError } from './WalletSyncError';
import { SendGuide } from './SendGuide';

export const dialogs: Record<DialogName, ReactComponentLike> = {
  walletSyncError: WalletSyncError,
  walletActions: WalletActionsDialogBox,
  createWalletGuide: CreateWalletGuide,
  // addAccountGuide: AddAccountGuide,
  sendGuide: SendGuide,
  addAccountDialog: AddAccountDialog,
  receiveDialog: ReceiveDialog,
};
