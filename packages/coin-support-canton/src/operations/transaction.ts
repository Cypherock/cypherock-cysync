import {
  IPreparedTransaction,
  IPreparedTransactionOutput,
} from '@cypherock/coin-support-interfaces';

export enum ICantonTransactionExpiryUnit {
  HOURS = 'Hours',
  DAYS = 'Days',
  WEEKS = 'Weeks',
  MONTHS = 'Months',
}

export interface ICantonTransactionExpiry {
  unit: ICantonTransactionExpiryUnit;
  value: number;
  calculatedValueInMs: number;
}

export enum ICantonTransactionExpiryInputKey {
  THREE_HOURS = '3 Hours',
  ONE_DAY = '1 Day',
  ONE_WEEK = '1 Week',
  TEN_DAYS = '10 Days',
  ONE_MONTH = '1 Month',
}

export const cantonTransactionExpiryMap: Record<
  ICantonTransactionExpiryInputKey,
  ICantonTransactionExpiry
> = {
  [ICantonTransactionExpiryInputKey.THREE_HOURS]: {
    unit: ICantonTransactionExpiryUnit.HOURS,
    value: 3,
    calculatedValueInMs: 3 * 60 * 60 * 1000,
  },
  [ICantonTransactionExpiryInputKey.ONE_DAY]: {
    unit: ICantonTransactionExpiryUnit.DAYS,
    value: 1,
    calculatedValueInMs: 1 * 24 * 60 * 60 * 1000,
  },
  [ICantonTransactionExpiryInputKey.ONE_WEEK]: {
    unit: ICantonTransactionExpiryUnit.WEEKS,
    value: 1,
    calculatedValueInMs: 7 * 24 * 60 * 60 * 1000,
  },
  [ICantonTransactionExpiryInputKey.TEN_DAYS]: {
    unit: ICantonTransactionExpiryUnit.DAYS,
    value: 10,
    calculatedValueInMs: 10 * 24 * 60 * 60 * 1000,
  },
  [ICantonTransactionExpiryInputKey.ONE_MONTH]: {
    unit: ICantonTransactionExpiryUnit.MONTHS,
    value: 1,
    calculatedValueInMs: 30 * 24 * 60 * 60 * 1000,
  },
};

export interface ICantonTransactionExpiryInput {
  key: ICantonTransactionExpiryInputKey;
  value: ICantonTransactionExpiry;
}

export interface IPreparedCantonTransactionInput
  extends IPreparedTransactionOutput {
  memo?: string;
  expiry?: ICantonTransactionExpiryInput;
}

export interface IPreparedCantonTransactionOutput
  extends IPreparedCantonTransactionInput {
  expiryDate?: string;
}

export interface IPreparedCantonTransaction extends IPreparedTransaction {
  userInputs: {
    outputs: IPreparedCantonTransactionInput[];
    isSendAll: boolean;
  };
  validation: {
    outputs: boolean[];
    hasEnoughBalance: boolean;
    isValidFee: boolean;
    isFeeBelowMin: boolean;
    ownOutputAddressNotAllowed: boolean[];
    zeroAmountNotAllowed: boolean;
    isInvalidExpiry: boolean;
  };
  staticData: {
    fees: string;
  };
  computedData: {
    output: IPreparedCantonTransactionOutput;
    fees: string;
    preparedTransaction?: any;
  };
}
