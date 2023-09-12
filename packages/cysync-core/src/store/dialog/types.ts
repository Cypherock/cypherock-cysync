import { AddAccountDialogProps } from '~/dialogs/AddAccount';
import { IHistoryDialogProps } from '~/dialogs/HistoryDialog';

export interface IDialogState {
  deviceAuthenticationDialog: {
    isOpen: boolean;
    data?: undefined;
  };
  deviceUpdateDialog: {
    isOpen: boolean;
    data?: undefined;
  };

  walletSyncError: {
    isOpen: boolean;
    data?: undefined;
  };

  addAccount: {
    isOpen: boolean;
    data?: AddAccountDialogProps;
  };

  receive: {
    isOpen: boolean;
    data?: undefined;
  };

  sendDialog: {
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
}

export const GuidedFlowMap = {
  createWallet: 'createWallet',
  importWallet: 'importWallet',
} as const;

export type GuidedFlowType = (typeof GuidedFlowMap)[keyof typeof GuidedFlowMap];

export type DialogName = keyof IDialogState;
