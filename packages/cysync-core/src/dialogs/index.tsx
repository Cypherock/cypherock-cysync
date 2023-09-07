import { ReactComponentLike } from 'prop-types';

import { DialogName } from '~/store';

import { AddAccountDialog } from './AddAccount';
import { GuidedFlow } from './GuidedFlow';
import { ReceiveDialog } from './Receive';
import { SendDialog } from './Send';
import { SignMessageDialog } from './SignMessage';
import { WalletActionsDialogBox } from './WalletActions';
import { WalletConnectDialog } from './WalletConnect';
import { WalletSyncError } from './WalletSyncError';
import {
  ChangePasswordDialog,
  RemovePasswordDialog,
  SetPasswordDialog,
} from './Password';
import { CySyncVersionDetailsDialog, ResetCySyncDialog } from './CySync';
import { AuthenticateX1VaultDialog } from './AuthenticateX1Vault';
import { AuthenticateX1CardDialog } from './AuthenticateX1Card';

export const dialogs: Record<DialogName, ReactComponentLike> = {
  walletSyncError: WalletSyncError,
  walletActions: WalletActionsDialogBox,
  walletConnect: WalletConnectDialog,
  guidedFlow: GuidedFlow,
  addAccount: AddAccountDialog,
  sendDialog: SendDialog,
  receive: ReceiveDialog,
  removePassword: RemovePasswordDialog,
  changePassword: ChangePasswordDialog,
  resetCySync: ResetCySyncDialog,
  setPassword: SetPasswordDialog,
  authenticateX1Vault: AuthenticateX1VaultDialog,
  authenticateX1Card: AuthenticateX1CardDialog,
  cySyncVersionDetails: CySyncVersionDetailsDialog,
  signMessage: SignMessageDialog,
};
