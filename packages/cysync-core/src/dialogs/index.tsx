import { ReactComponentLike } from 'prop-types';

import { DialogName } from '~/store';

import { AddAccountDialog } from './AddAccount';
import { AddTokenDialog } from './AddToken';
import { AppUpdateDialog } from './AppUpdateDialog';
import {
  AuthenticateX1CardDialog,
  AuthenticateX1VaultDialog,
} from './Authenticate';
import { BetaNotificationDialog } from './BetaNotificationDialog';
import { ContactSupportDialog } from './ContactSupport';
import { ReleaseNotesDialog, ResetCySyncDialog } from './CySync';
import { DeleteAccountDialog } from './DeleteAccountDialog';
import { DeployAccountDialog } from './DeployAccount';
import { DeviceAuthenticationDialog } from './DeviceAuthenticationDialog';
import { DeviceUpdateDialog } from './DeviceUpdateDialog';
import { EditAccountDialog } from './EditAccountDialog';
import { ErrorDialog } from './ErrorDialog';
import { GuidedFlow } from './GuidedFlow';
import { HistoryDialog } from './HistoryDialog';
import {
  InheritanceEditExecutorMessageDialog,
  InheritanceEditReminderTimeDialog,
  InheritanceEditUserDetailsDialog,
  InheritancePlanLoginDialog,
  InheritanceSyncPlansDialog,
  InheritanceSilverPlanPurchaseDialog,
  InheritanceGoldPlanPurchaseDialog,
  InheritanceEditEncryptedMessageDialog,
} from './Inheritance';
import { InheritanceEstateRecoveryDialog } from './Inheritance/EstateRecovery';
import { InheritancePinRecoveryDialog } from './Inheritance/PinRecovery';
import { MobileAppSyncDialog } from './MobileAppSync';
import {
  ChangePasswordDialog,
  RemovePasswordDialog,
  SetPasswordDialog,
} from './Password';
import { ReceiveDialog } from './Receive';
import { SendDialog } from './Send';
import { SignMessageDialog } from './SignMessage';
import { SwapDialog } from './SwapDialog';
import { WalletActionsDialogBox } from './WalletActions';
import { WalletConnectDialog } from './WalletConnect';
import { WalletSyncError } from './WalletSyncError';

export const dialogs: Record<DialogName, ReactComponentLike> = {
  walletSyncError: WalletSyncError,
  walletActions: WalletActionsDialogBox,
  walletConnect: WalletConnectDialog,
  guidedFlow: GuidedFlow,
  addAccount: AddAccountDialog,
  addToken: AddTokenDialog,
  sendDialog: SendDialog,
  deployAccountDialog: DeployAccountDialog,
  historyDialog: HistoryDialog,
  receive: ReceiveDialog,
  removePassword: RemovePasswordDialog,
  editAccount: EditAccountDialog,
  changePassword: ChangePasswordDialog,
  resetCySync: ResetCySyncDialog,
  setPassword: SetPasswordDialog,
  authenticateX1Vault: AuthenticateX1VaultDialog,
  authenticateX1Card: AuthenticateX1CardDialog,
  releaseNotes: ReleaseNotesDialog,
  signMessage: SignMessageDialog,
  deviceUpdateDialog: DeviceUpdateDialog,
  deviceAuthenticationDialog: DeviceAuthenticationDialog,
  appUpdateDialog: AppUpdateDialog,
  errorDialog: ErrorDialog,
  contactSupportDialog: ContactSupportDialog,
  deleteAccount: DeleteAccountDialog,
  betaNotificationDialog: BetaNotificationDialog,
  inheritanceSyncPlans: InheritanceSyncPlansDialog,
  inheritancePlanLogin: InheritancePlanLoginDialog,
  inheritanceSilverPlanPurchase: InheritanceSilverPlanPurchaseDialog,
  inheritanceEditExecutorMessage: InheritanceEditExecutorMessageDialog,
  inheritanceEditReminderTime: InheritanceEditReminderTimeDialog,
  inheritanceEditUserDetails: InheritanceEditUserDetailsDialog,
  inheritancePinRecovery: InheritancePinRecoveryDialog,
  inheritanceGoldPlanPurchase: InheritanceGoldPlanPurchaseDialog,
  inheritanceEditEncryptedMessage: InheritanceEditEncryptedMessageDialog,
  inheritanceEstateRecovery: InheritanceEstateRecoveryDialog,
  mobileAppSyncDialog: MobileAppSyncDialog,
  swapDialog: SwapDialog,
};
