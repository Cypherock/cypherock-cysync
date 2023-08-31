import { AddAccountDialogProps } from '~/dialogs/AddAccount';
import { IHistoryDialogProps } from '~/dialogs/HistoryDialog';

export interface IDialogState {
  addAccount: {
    isOpen: boolean;
    data?: AddAccountDialogProps;
  };

  receive: {
    isOpen: boolean;
    data?: undefined;
  };

  walletSyncError: {
    isOpen: boolean;
    data?: undefined;
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

  sendDialog: {
    isOpen: boolean;
    data?: undefined;
  };

  historyDialog: {
    isOpen: boolean;
    data?: IHistoryDialogProps;
  };
}

export const GuidedFlowMap = {
  createWallet: 'createWallet',
  importWallet: 'importWallet',
} as const;

export type GuidedFlowType = (typeof GuidedFlowMap)[keyof typeof GuidedFlowMap];

export type DialogName = keyof IDialogState;
