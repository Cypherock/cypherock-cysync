import { IInheritancePlan } from '@cypherock/db-interfaces';

import { ReminderPeriod } from '~/services/inheritance/login/schema';

export interface IWalletAuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const reminderPeriodStringToNumMap: Record<string, number> = {
  monthly: 1,
  quarterly: 3,
  'half-yearly': 6,
  yearly: 12,
  '': 0,
} as const;

export const reminderPeriodNumToStringMap: Record<number, ReminderPeriod> = {
  1: 'monthly',
  3: 'quarterly',
  6: 'half-yearly',
  12: 'yearly',
} as const;

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
  executor?: {
    name: string;
    email: string;
    alternateEmail: string;
  };
  reminderPeriod: number;
}

export interface IInheritanceState {
  walletAuthTokens: Record<string, IWalletAuthTokens | undefined>;
  seedAuthTokens: Record<string, IWalletAuthTokens | undefined>;
  inheritancePlans: IInheritancePlan[];
  inheritancePlanDetails: Record<string, IInheritancePlanDetails | undefined>;
  isLoaded: boolean;
}
