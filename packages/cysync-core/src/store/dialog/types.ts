export interface IDialogState {
  addAccount: {
    isOpen: boolean;
    data?: {
      walletId?: string;
      coinId?: string;
    };
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
}

export const GuidedFlowMap = {
  createWallet: 'createWallet',
} as const;

export type GuidedFlowType = (typeof GuidedFlowMap)[keyof typeof GuidedFlowMap];

export type DialogName = keyof IDialogState;
