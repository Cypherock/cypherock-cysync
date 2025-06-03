import { AddAccountDialogProps } from '~/dialogs/AddAccount';
import { AddTokenDialogProps } from '~/dialogs/AddToken';
import { IContactSupportDialogProps } from '~/dialogs/ContactSupport';
import { DeleteAccountDialogProps } from '~/dialogs/DeleteAccountDialog';
import { DeployAccountDialogProps } from '~/dialogs/DeployAccount/context';
import { DeviceAuthenticationDialogProps } from '~/dialogs/DeviceAuthenticationDialog';
import { EditAccountDialogProps } from '~/dialogs/EditAccountDialog';
import { ErrorDialogProps } from '~/dialogs/ErrorDialog';
import { IHistoryDialogProps } from '~/dialogs/HistoryDialog';
import {
  InheritanceEditUserDetailsDialogProps,
  InheritanceEstateRecoveryDialogProps,
  InheritancePinRecoveryDialogProps,
  InheritancePlanLoginDialogProps,
} from '~/dialogs/Inheritance';
import { InheritanceEditExecutorMessageDialogProps } from '~/dialogs/Inheritance/EditExecutorMessage/context';
import { InheritanceEditReminderTimeDialogProps } from '~/dialogs/Inheritance/EditReminderTime/context';
import { ReceiveDialogProps } from '~/dialogs/Receive';
import { SendDialogProps } from '~/dialogs/Send/';
import { ISwapDialogProps } from '~/dialogs/SwapDialog';
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

export const openDeployAccountDialog = (data?: DeployAccountDialogProps) =>
  openDialog({ name: 'deployAccountDialog', data });

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

export const openSwapHistoryDialog = (props?: ISwapDialogProps) =>
  openDialog({ name: 'swapDialog', data: props });

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

export const openEditAccountDialog = (props?: EditAccountDialogProps) =>
  openDialog({ name: 'editAccount', data: props });

export const openInheritanceSyncPlansDialog = () =>
  openDialog({ name: 'inheritanceSyncPlans', data: undefined });

export const openInheritancePlanLoginDialog = (
  props: InheritancePlanLoginDialogProps,
) => openDialog({ name: 'inheritancePlanLogin', data: props });

export const openInheritanceSilverPlanPurchaseDialog = () =>
  openDialog({ name: 'inheritanceSilverPlanPurchase', data: undefined });

export const openInheritanceGoldPlanPurchaseDialog = () =>
  openDialog({ name: 'inheritanceGoldPlanPurchase', data: undefined });

export const openInheritanceEditExecutorMessageDialog = (
  props?: InheritanceEditExecutorMessageDialogProps,
) => openDialog({ name: 'inheritanceEditExecutorMessage', data: props });

export const openInheritanceEditReminderTimeDialog = (
  props: InheritanceEditReminderTimeDialogProps,
) => openDialog({ name: 'inheritanceEditReminderTime', data: props });

export const openInheritanceEditUserDetailsDialog = (
  props?: InheritanceEditUserDetailsDialogProps,
) => openDialog({ name: 'inheritanceEditUserDetails', data: props });

export const openInheritancePinRecoveryDialog = (
  props: InheritancePinRecoveryDialogProps,
) => openDialog({ name: 'inheritancePinRecovery', data: props });

export const openInheritanceEditEncryptedMessageDialog = () =>
  openDialog({ name: 'inheritanceEditEncryptedMessage', data: undefined });

export const openInheritanceEstateRecoveryDialog = (
  props: InheritanceEstateRecoveryDialogProps,
) => openDialog({ name: 'inheritanceEstateRecovery', data: props });

export const openMobileAppSyncDialog = () =>
  openDialog({ name: 'mobileAppSyncDialog', data: undefined });
