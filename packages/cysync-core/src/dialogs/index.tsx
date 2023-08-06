import { ReactComponentLike } from 'prop-types';

import { DialogName } from '~/store';

import { AddAccountDialog } from './AddAccount';
import { GuidedFlow } from './GuidedFlow';
import { WalletActionsDialogBox } from './WalletActions';
import { WalletSyncError } from './WalletSyncError';
import { DeviceUpdateDialogBox } from '~/dialogs/UpdateDevice';
import { ReceiveDialog } from '~/dialogs/Receive';

export const dialogs: Record<DialogName, ReactComponentLike> = {
  walletSyncError: WalletSyncError,
  walletActions: WalletActionsDialogBox,
  guidedFlow: GuidedFlow,
  addAccount: AddAccountDialog,
  updateDevice: DeviceUpdateDialogBox,
  receiveDialog: ReceiveDialog,
};
