import { AddAccountDialogProps } from '~/dialogs/AddAccount';

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

  walletConnect: {
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

  cySyncVersionDetails: {
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
