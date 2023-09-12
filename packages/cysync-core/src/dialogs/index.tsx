import { ReactComponentLike } from 'prop-types';

import { DialogName } from '~/store';

import { AddAccountDialog } from './AddAccount';
import { DeviceAuthenticationDialog } from './DeviceAuthenticationDialog';
import { DeviceUpdateDialog } from './DeviceUpdateDialog';
import { GuidedFlow } from './GuidedFlow';
import { HistoryDialog } from './HistoryDialog';
import { ReceiveDialog } from './Receive';
import { SendDialog } from './Send';
import { SignMessageDialog } from './SignMessage';
import { WalletActionsDialogBox } from './WalletActions';
import { WalletConnectDialog } from './WalletConnect';
import { WalletSyncError } from './WalletSyncError';

export const dialogs: Record<DialogName, ReactComponentLike> = {
  walletSyncError: WalletSyncError,
  walletActions: WalletActionsDialogBox,
  walletConnect: WalletConnectDialog,
  guidedFlow: GuidedFlow,
  addAccount: AddAccountDialog,
  sendDialog: SendDialog,
  historyDialog: HistoryDialog,
  receive: ReceiveDialog,
  signMessage: SignMessageDialog,
  deviceUpdateDialog: DeviceUpdateDialog,
  deviceAuthenticationDialog: DeviceAuthenticationDialog,
};
