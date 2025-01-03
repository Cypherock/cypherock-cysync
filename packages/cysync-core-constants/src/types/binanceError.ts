import { ServerErrorDetails } from './serverError';

// TODO: first error should be an unkown error
export enum BinanceErrorType {
  SYSTEM_ERROR = 'BIN_0000',
  SYSTEM_BUSY = 'BIN_0001',
  ILLEGAL_PARAMETERS = 'BIN_0002',
  MISSING_CLIENT_ID = 'BIN_0003',
  PARTNER_DISABLED = 'BIN_0004',
  ORDER_NOT_FOUND = 'BIN_0005',
  UNSUPPORTED_ORDER_TYPE = 'BIN_0006',
  PARTNER_NOT_FOUND = 'BIN_0007',
  PAYMENT_METHOD_NOT_SUPPORTED = 'BIN_0008',
}

export const binanceErrorCodeMap: Record<string, BinanceErrorType> = {
  '1130101': BinanceErrorType.SYSTEM_ERROR,
  '1130102': BinanceErrorType.SYSTEM_BUSY,
  '1130303': BinanceErrorType.ILLEGAL_PARAMETERS,
  '1130304': BinanceErrorType.MISSING_CLIENT_ID,
  '1130305': BinanceErrorType.PARTNER_DISABLED,
  '1130306': BinanceErrorType.ORDER_NOT_FOUND,
  '1130307': BinanceErrorType.UNSUPPORTED_ORDER_TYPE,
  '1130314': BinanceErrorType.PARTNER_NOT_FOUND,
  '1130320': BinanceErrorType.PAYMENT_METHOD_NOT_SUPPORTED,
};

type BinanceCodeToErrorMap = {
  [property in BinanceErrorType]: {
    message: string;
  };
};

export const binanceErrorTypeDetails: BinanceCodeToErrorMap = {
  [BinanceErrorType.SYSTEM_ERROR]: {
    message: 'System error occurred',
  },
  [BinanceErrorType.SYSTEM_BUSY]: {
    message: 'System is busy, please try again later',
  },
  [BinanceErrorType.ILLEGAL_PARAMETERS]: {
    message: 'Illegal parameters provided',
  },
  [BinanceErrorType.MISSING_CLIENT_ID]: {
    message: 'Missing client ID from the request',
  },
  [BinanceErrorType.PARTNER_DISABLED]: {
    message: 'Partner is disabled',
  },
  [BinanceErrorType.ORDER_NOT_FOUND]: {
    message: 'Order not found',
  },
  [BinanceErrorType.UNSUPPORTED_ORDER_TYPE]: {
    message: 'Unsupported order type',
  },
  [BinanceErrorType.PARTNER_NOT_FOUND]: {
    message: 'Partner not found',
  },
  [BinanceErrorType.PAYMENT_METHOD_NOT_SUPPORTED]: {
    message: 'Payment method not supported',
  },
};

export class BinanceServerError extends Error {
  public code: BinanceErrorType;

  public details?: ServerErrorDetails;

  public isBinanceError = true;

  constructor(
    errorCode: string,
    message?: string,
    details?: ServerErrorDetails,
  ) {
    super();

    const mappedErrorCode =
      binanceErrorCodeMap[errorCode] ?? BinanceErrorType.SYSTEM_ERROR;
    this.message = message ?? binanceErrorTypeDetails[mappedErrorCode].message;
    this.code = mappedErrorCode;
    this.details = details;
  }

  public toJSON() {
    return {
      isBinanceError: this.isBinanceError,
      code: this.code,
      message: `${this.code}: ${this.message}`,
      ...(this.details ?? {}),
      stack: this.stack,
    };
  }
}
