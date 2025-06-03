import { AddAccountDialogProps } from '~/dialogs/AddAccount';
import { AddTokenDialogProps } from '~/dialogs/AddToken';
import { DeleteAccountDialogProps } from '~/dialogs/DeleteAccountDialog';
import { DeployAccountDialogProps } from '~/dialogs/DeployAccount/context';
import { ErrorDialogProps } from '~/dialogs/ErrorDialog';
import { IHistoryDialogProps } from '~/dialogs/HistoryDialog';
import {
  InheritanceEstateRecoveryDialogProps,
  InheritancePinRecoveryDialogProps,
  InheritancePlanLoginDialogProps,
} from '~/dialogs/Inheritance';
import { InheritanceEditExecutorMessageDialogProps } from '~/dialogs/Inheritance/EditExecutorMessage/context';
import { SendDialogProps } from '~/dialogs/Send';
import { ISwapDialogProps } from '~/dialogs/SwapDialog';

export interface IDialogState {
  deviceAuthenticationDialog: {
    isOpen: boolean;
    data?: undefined;
  };

  appUpdateDialog: {
    isOpen: boolean;
    data?: undefined;
  };

  deviceUpdateDialog: {
    isOpen: boolean;
    data?: undefined;
  };

  errorDialog: {
    isOpen: boolean;
    data?: ErrorDialogProps;
  };

  walletSyncError: {
    isOpen: boolean;
    data?: undefined;
  };

  addAccount: {
    isOpen: boolean;
    data?: AddAccountDialogProps;
  };

  addToken: {
    isOpen: boolean;
    data?: AddTokenDialogProps;
  };

  receive: {
    isOpen: boolean;
    data?: undefined;
  };

  sendDialog: {
    isOpen: boolean;
    data?: SendDialogProps;
  };

  deployAccountDialog: {
    isOpen: boolean;
    data?: DeployAccountDialogProps;
  };

  removePassword: {
    isOpen: boolean;
    data?: undefined;
  };

  changePassword: {
    isOpen: boolean;
    data?: undefined;
  };

  editAccount: {
    isOpen: boolean;
    data?: undefined;
  };

  resetCySync: {
    isOpen: boolean;
    data?: undefined;
  };

  setPassword: {
    isOpen: boolean;
    data?: undefined;
  };

  authenticateX1Vault: {
    isOpen: boolean;
    data?: undefined;
  };

  authenticateX1Card: {
    isOpen: boolean;
    data?: undefined;
  };

  releaseNotes: {
    isOpen: boolean;
    data?: undefined;
  };

  historyDialog: {
    isOpen: boolean;
    data?: IHistoryDialogProps;
  };

  swapDialog: {
    isOpen: boolean;
    data?: ISwapDialogProps;
  };

  walletActions: {
    isOpen: boolean;
    data?: undefined;
  };

  guidedFlow: {
    isOpen: boolean;
    data?: {
      type: GuidedFlowType;
    };
  };

  walletConnect: {
    isOpen: boolean;
    data?: undefined;
  };

  signMessage: {
    isOpen: boolean;
    data?: undefined;
  };

  contactSupportDialog: {
    isOpen: boolean;
    data?: undefined;
  };

  deleteAccount: {
    isOpen: boolean;
    data?: DeleteAccountDialogProps;
  };

  betaNotificationDialog: {
    isOpen: boolean;
    data?: undefined;
  };

  inheritanceSyncPlans: {
    isOpen: boolean;
    data?: undefined;
  };

  inheritancePlanLogin: {
    isOpen: boolean;
    data?: InheritancePlanLoginDialogProps;
  };

  inheritanceSilverPlanPurchase: {
    isOpen: boolean;
    data?: undefined;
  };

  inheritanceGoldPlanPurchase: {
    isOpen: boolean;
    data?: undefined;
  };

  inheritanceEditExecutorMessage: {
    isOpen: boolean;
    data?: InheritanceEditExecutorMessageDialogProps;
  };

  inheritanceEditReminderTime: {
    isOpen: boolean;
    data?: undefined;
  };

  inheritanceEditUserDetails: {
    isOpen: boolean;
    data?: undefined;
  };

  inheritancePinRecovery: {
    isOpen: boolean;
    data?: InheritancePinRecoveryDialogProps;
  };

  inheritanceEditEncryptedMessage: {
    isOpen: boolean;
    data?: undefined;
  };

  inheritanceEstateRecovery: {
    isOpen: boolean;
    data?: InheritanceEstateRecoveryDialogProps;
  };

  mobileAppSyncDialog: {
    isOpen: boolean;
    data?: undefined;
  };
}

export const GuidedFlowMap = {
  createWallet: 'createWallet',
  importWallet: 'importWallet',
} as const;

export type GuidedFlowType = (typeof GuidedFlowMap)[keyof typeof GuidedFlowMap];

export type DialogName = keyof IDialogState;
