import { AddAccountDialogProps } from '~/dialogs/AddAccount';
import { AddTokenDialogProps } from '~/dialogs/AddToken';
import { IContactSupportDialogProps } from '~/dialogs/ContactSupport';
import { DeleteAccountDialogProps } from '~/dialogs/DeleteAccountDialog';
import { DeviceAuthenticationDialogProps } from '~/dialogs/DeviceAuthenticationDialog';
import { ErrorDialogProps } from '~/dialogs/ErrorDialog';
import { IHistoryDialogProps } from '~/dialogs/HistoryDialog';
import { ReceiveDialogProps } from '~/dialogs/Receive';
import { SendDialogProps } from '~/dialogs/Send/';
import { GuidedFlowType, openDialog } from '~/store';

export const openWalletSyncErrorDialog = () =>
  openDialog({ name: 'walletSyncError', data: undefined });

export const openWalletActionsDialog = () =>
  openDialog({ name: 'walletActions', data: undefined });

export const openWalletConnectDialog = () =>
  openDialog({ name: 'walletConnect', data: undefined });

export const openSignMessageDialog = () =>
  openDialog({ name: 'signMessage', data: undefined });

export const openGuidedFlowDialog = (type: GuidedFlowType) =>
  openDialog({ name: 'guidedFlow', data: { type } });

export const openAddAccountDialog = (props?: AddAccountDialogProps) =>
  openDialog({ name: 'addAccount', data: props });

export const openAddTokenDialog = (props?: AddTokenDialogProps) =>
  openDialog({ name: 'addToken', data: props });

export const openReceiveDialog = (data?: ReceiveDialogProps) =>
  openDialog({ name: 'receive', data });

export const openSendDialog = (data?: SendDialogProps) =>
  openDialog({ name: 'sendDialog', data });

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

export const openReleaseNotesDialog = () =>
  openDialog({ name: 'releaseNotes', data: undefined });

export const openHistoryDialog = (props?: IHistoryDialogProps) =>
  openDialog({ name: 'historyDialog', data: props });

export const openDeviceUpdateDialog = () =>
  openDialog({ name: 'deviceUpdateDialog', data: undefined });

export const openDeviceAuthenticationDialog = (
  props?: DeviceAuthenticationDialogProps,
) => openDialog({ name: 'deviceAuthenticationDialog', data: props });

export const openAppUpdateDialog = () =>
  openDialog({ name: 'appUpdateDialog', data: undefined });

export const openErrorDialog = (props: ErrorDialogProps) =>
  openDialog({ name: 'errorDialog', data: props });

export const openContactSupportDialog = (props?: IContactSupportDialogProps) =>
  openDialog({ name: 'contactSupportDialog', data: props });

export const openDeleteAccountDialog = (props: DeleteAccountDialogProps) =>
  openDialog({ name: 'deleteAccount', data: props });

export const openBetaNotificationDialog = () =>
  openDialog({ name: 'betaNotificationDialog', data: undefined });
