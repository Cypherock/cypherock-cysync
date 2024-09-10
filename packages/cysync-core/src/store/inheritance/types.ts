import { IInheritancePlan } from '@cypherock/db-interfaces';

export interface IWalletAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IInheritanceState {
  walletAuthTokens: Record<string, IWalletAuthTokens | undefined>;
  inheritancePlans: IInheritancePlan[];
  isLoaded: boolean;
}
