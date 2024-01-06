import { AddAccountDialogProps } from '~/dialogs/AddAccount';
import { AddTokenDialogProps } from '~/dialogs/AddToken';
import { DeleteAccountDialogProps } from '~/dialogs/DeleteAccountDialog';
import { ErrorDialogProps } from '~/dialogs/ErrorDialog';
import { IHistoryDialogProps } from '~/dialogs/HistoryDialog';
import { SendDialogProps } from '~/dialogs/Send';

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

  removePassword: {
    isOpen: boolean;
    data?: undefined;
  };

  changePassword: {
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
}

export const GuidedFlowMap = {
  createWallet: 'createWallet',
  importWallet: 'importWallet',
} as const;

export type GuidedFlowType = (typeof GuidedFlowMap)[keyof typeof GuidedFlowMap];

export type DialogName = keyof IDialogState;
