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
  walletCreation: {
    isOpen: boolean;
    data?: undefined;
  };
  createWalletGuide: {
    isOpen: boolean;
    data?: undefined;
  };
  importWalletGuide: {
    isOpen: boolean;
    data?: undefined;
  };
}

export type DialogName = keyof IDialogState;
