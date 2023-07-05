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
}

export type DialogName = keyof IDialogState;
