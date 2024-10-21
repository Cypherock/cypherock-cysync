export interface IUserDetails {
  name: string;
  email: string;
  alternateEmail: string;
}

export enum OtpVerificationConcern {
  primary = 'primary',
  alternate = 'alternate',
  login = 'login',
}

export interface IOtpVerificationDetails {
  id: string;
  concern: OtpVerificationConcern;
  emails: string[];
  retriesRemaining: number;
  otpExpiry: string;
  showIncorrectError?: boolean;
}

export const WalletAuthLoginStep = {
  fetchRequestId: 0,
  walletAuth: 1,
  validateSignature: 2,
  userDetails: 3,
  primaryOtpVerify: 4,
  alternateOtpVerify: 5,
  loginOtpVerify: 6,
  completed: 7,
} as const;

export type WalletAuthLoginStep =
  (typeof WalletAuthLoginStep)[keyof typeof WalletAuthLoginStep];
