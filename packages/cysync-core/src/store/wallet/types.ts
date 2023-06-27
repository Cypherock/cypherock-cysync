import { IWallet } from '@cypherock/db-interfaces';

export interface IWalletState {
  isLoaded: boolean;
  wallets: IWallet[];
  deletedWallets: IWallet[];
  deleteWalletStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}
