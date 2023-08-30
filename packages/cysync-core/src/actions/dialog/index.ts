import { Row } from '~/pages/MainApp/Components';
import { AddAccountDialogProps } from '~/dialogs/AddAccount';
import { GuidedFlowType, openDialog } from '~/store';

export const openWalletSyncErrorDialog = () =>
  openDialog({ name: 'walletSyncError', data: undefined });

export const openWalletActionsDialog = () =>
  openDialog({ name: 'walletActions', data: undefined });

export const openGuidedFlowDialog = (type: GuidedFlowType) =>
  openDialog({ name: 'guidedFlow', data: { type } });

export const openAddAccountDialog = (props?: AddAccountDialogProps) =>
  openDialog({ name: 'addAccount', data: props });

export const openReceiveDialog = () =>
  openDialog({ name: 'receive', data: undefined });

export const openSendDialog = () =>
  openDialog({ name: 'sendDialog', data: undefined });

export const openHistoryDialog = (row: Row) =>
  openDialog({ name: 'historyDialog', data: row });
