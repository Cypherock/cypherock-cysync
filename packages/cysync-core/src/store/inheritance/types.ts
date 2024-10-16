import { IInheritancePlan } from '@cypherock/db-interfaces';

export interface IWalletAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface IInheritancePlanDetails {
  walletId: string;
  name: string;
  activationDate: number;
  expiryDate: number;
  owner: {
    name: string;
    email: string;
    alternateEmail: string;
  };
  nominee: {
    name: string;
    email: string;
    alternateEmail: string;
  }[];
  executor: {
    name: string;
    email: string;
    alternateEmail: string;
  };
}

export interface IInheritanceState {
  walletAuthTokens: Record<string, IWalletAuthTokens | undefined>;
  seedAuthTokens: Record<string, IWalletAuthTokens | undefined>;
  inheritancePlans: IInheritancePlan[];
  inheritancePlanDetails: Record<string, IInheritancePlanDetails | undefined>;
  isLoaded: boolean;
}
