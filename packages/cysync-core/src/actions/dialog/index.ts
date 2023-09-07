import { AddAccountDialogProps } from '~/dialogs/AddAccount';
import { GuidedFlowType, openDialog } from '~/store';

export const openWalletSyncErrorDialog = () =>
  openDialog({ name: 'walletSyncError', data: undefined });

export const openWalletActionsDialog = () =>
  openDialog({ name: 'walletActions', data: undefined });

export const openWalletConnectDialog = () =>
  openDialog({ name: 'walletConnect', data: undefined });

export const openGuidedFlowDialog = (type: GuidedFlowType) =>
  openDialog({ name: 'guidedFlow', data: { type } });

export const openAddAccountDialog = (props?: AddAccountDialogProps) =>
  openDialog({ name: 'addAccount', data: props });

export const openReceiveDialog = () =>
  openDialog({ name: 'receive', data: undefined });

export const openSendDialog = () =>
  openDialog({ name: 'sendDialog', data: undefined });

export const openRemovePasswordDialog = () =>
  openDialog({ name: 'removePassword', data: undefined });

export const openChangePasswordDialog = () =>
  openDialog({ name: 'changePassword', data: undefined });

export const openResetCySyncDialog = () =>
  openDialog({ name: 'resetCySync', data: undefined });

export const openSetPasswordDialog = () =>
  openDialog({ name: 'setPassword', data: undefined });

export const openAuthenticateX1CardDialog = () =>
  openDialog({ name: 'authenticateX1Card', data: undefined });

export const openAuthenticateX1VaultDialog = () =>
  openDialog({ name: 'authenticateX1Vault', data: undefined });

export const openCySyncVersionDetailsDialog = () =>
  openDialog({ name: 'cySyncVersionDetails', data: undefined });
