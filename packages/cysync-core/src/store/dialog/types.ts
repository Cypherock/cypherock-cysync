export interface IDialogState {
  addAccountDialog: {
    isOpen: boolean;
    data?: {
      walletId?: string;
      coinId?: string;
    };
  };

  receiveDialog: {
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

  createWalletGuide: {
    isOpen: boolean;
    data?: undefined;
  };
}

export type DialogName = keyof IDialogState;
