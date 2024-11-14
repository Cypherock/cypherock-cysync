import { coinFamiliesMap } from '@cypherock/coins';

import { ServerErrorDetails } from '../serverError';

export const coinFamiliesMapWithDefault = {
  ...coinFamiliesMap,
  default: 'default',
} as const;

export type CoinFamilyWithDefault =
  (typeof coinFamiliesMapWithDefault)[keyof typeof coinFamiliesMapWithDefault];

export enum DefaultCoinErrorType {
  DEFAULT = 'DEF_0000',
}

// fill this variable as u define coin errors: ServerCoinErrorTypes = DefaultErrorType | XrpServerErrorType | BtcServerErrorType | EvmServerErrorType
export type ServerCoinErrorTypes = DefaultCoinErrorType;

interface ServerCoinErrorParams {
  code: string;
  message: string;
  coinFamily: CoinFamilyWithDefault;
  details?: ServerErrorDetails;
}

export class ServerCoinError extends Error {
  public readonly isServerCoinError = true;

  public code: string;

  public coinFamily: CoinFamilyWithDefault;

  public details?: ServerErrorDetails;

  constructor({ code, message, coinFamily, details }: ServerCoinErrorParams) {
    super(message);
    this.code = code;
    this.details = details;
    this.coinFamily = coinFamily;
  }

  public toJSON() {
    return {
      isServerCoinError: this.isServerCoinError,
      code: this.code,
      coinFamily: this.coinFamily,
      message: `${this.code}: ${this.message}`,
      ...(this.details ?? {}),
      stack: this.stack,
    };
  }
}
