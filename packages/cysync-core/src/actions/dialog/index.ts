import { IDialogState, openDialog } from '~/store';

export const openAddAccountDialog = (
  data: IDialogState['addAccount']['data'],
) => openDialog({ name: 'addAccount', data });

export const openWalletSyncErrorDialog = () =>
  openDialog({ name: 'walletSyncError', data: undefined });
export const openWalletCreationDialog = () =>
  openDialog({ name: 'walletCreation', data: undefined });
export const openCreateWalletGuideDialog = () =>
  openDialog({ name: 'createWalletGuide', data: undefined });
export const openImportWalletGuideDialog = () =>
  openDialog({ name: 'importWalletGuide', data: undefined });
