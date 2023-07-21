import { ReactComponentLike } from 'prop-types';

import { DialogName } from '~/store';

import { AddAccountDialog } from './AddAccountGuide';
import { CreateWalletGuide } from './CreateWalletGuide';
import { ReceiveGuide } from './Receive';
import { WalletActionsDialogBox } from './WalletActions';
import { WalletSyncError } from './WalletSyncError';

export const dialogs: Record<DialogName, ReactComponentLike> = {
  walletSyncError: WalletSyncError,
  walletActions: WalletActionsDialogBox,
  createWalletGuide: CreateWalletGuide,
  addAccountDialog: AddAccountDialog,
  receiveGuide: ReceiveGuide,
};
