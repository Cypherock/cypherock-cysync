import { IWallet } from '@cypherock/db-interfaces';

type WalletStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export interface IWalletState {
  isLoaded: boolean;
  wallets: IWallet[];
  deletedWallets: IWallet[];
  deleteWalletStatus: WalletStatus;
  syncWalletStatus: WalletStatus;
}
