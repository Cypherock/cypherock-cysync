import { AddAccountDialogProps } from '~/dialogs/AddAccount';
import { IHistoryDialogProps } from '~/dialogs/HistoryDialog';
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

export const openReceiveDialog = () =>
  openDialog({ name: 'receive', data: undefined });

export const openSendDialog = () =>
  openDialog({ name: 'sendDialog', data: undefined });

export const openHistoryDialog = (props?: IHistoryDialogProps) =>
  openDialog({ name: 'historyDialog', data: props });

export const openDeviceUpdateDialog = () =>
  openDialog({ name: 'deviceUpdateDialog', data: undefined });

export const openDeviceAuthenticationDialog = () =>
  openDialog({ name: 'deviceAuthenticationDialog', data: undefined });
