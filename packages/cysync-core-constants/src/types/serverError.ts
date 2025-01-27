export enum ServerErrorType {
  UNKNOWN_ERROR = 'SER_0000',
  CONNOT_CONNECT = 'SER_0001',

  OTP_VERIFICATION_FAILED = 'SER_1001',
  LOGIN_FAILED = 'SER_1003',
  SIGNATURE_VERIFICATION_FAILED = 'SER_1004',
  INVALID_REQUEST = 'SER_1005',
  UNAUTHORIZED_ACCESS = 'SER_1006',
  RESOURCE_NOT_FOUND = 'SER_1007',
  INTERNAL_SERVER_ERROR = 'SER_1008',
  REQUEST_TIMEOUT = 'SER_1009',

  // Inheritance Errors
  OTP_EXPIRED = 'SER_1010',
  PAYLOAD_VALIDATION_ERROR = 'SER_1011',
  MAX_RETRIES_EXCEEDED = 'SER_1012',
  ACCOUNT_LOCKED = 'SER_1013',
  SERVICE_UNAVAILABLE = 'SER_1014',
  REQUEST_CONFLICT = 'SER_1015',
  VALIDATION_ERROR = 'SER_1016',
  MISSING_WALLET = 'SER_1017',
  MISSING_USER = 'SER_1018',
  MISSING_NOMINEE = 'SER_1019',
  MISSING_EXECUTOR = 'SER_1020',
  MISSING_SESSION = 'SER_1021',
  INVALID_COUPON = 'SER_1022',
  INVALID_SESSION = 'SER_1023',
  INVALID_DEVICE = 'SER_1024',
  INVALID_PRIVATE_KEY = 'SER_1025',
  ACTIVE_PLAN_FOUND = 'SER_1026',
  OTP_RESEND_LIMIT = 'SER_1027',
  DUPLICATE_EMAIL = 'SER_1028',

  TRANSACTION_BROADCAST_FAILED = 'SER_2000',
}

type CodeToErrorMap = {
  [property in ServerErrorType]: {
    message: string;
  };
};

export const serverErrorTypeDetails: CodeToErrorMap = {
  [ServerErrorType.UNKNOWN_ERROR]: {
    message: 'Unknown server error',
  },
  [ServerErrorType.CONNOT_CONNECT]: {
    message: 'Cannot connect to the server',
  },
  [ServerErrorType.OTP_VERIFICATION_FAILED]: {
    message: 'OTP verification failed',
  },
  [ServerErrorType.LOGIN_FAILED]: {
    message: 'Login failed',
  },
  [ServerErrorType.SIGNATURE_VERIFICATION_FAILED]: {
    message: 'Signature verification failed',
  },
  [ServerErrorType.INVALID_REQUEST]: {
    message: 'Invalid request',
  },
  [ServerErrorType.UNAUTHORIZED_ACCESS]: {
    message: 'Unauthorized access',
  },
  [ServerErrorType.RESOURCE_NOT_FOUND]: {
    message: 'Resource not found',
  },
  [ServerErrorType.INTERNAL_SERVER_ERROR]: {
    message: 'Internal server error',
  },
  [ServerErrorType.REQUEST_TIMEOUT]: {
    message: 'Request timeout',
  },
  [ServerErrorType.OTP_EXPIRED]: {
    message: 'OTP expired',
  },
  [ServerErrorType.PAYLOAD_VALIDATION_ERROR]: {
    message: 'Payload validation error',
  },
  [ServerErrorType.MAX_RETRIES_EXCEEDED]: {
    message: 'Maximum retries exceeded',
  },
  [ServerErrorType.ACCOUNT_LOCKED]: {
    message: 'Account locked',
  },
  [ServerErrorType.SERVICE_UNAVAILABLE]: {
    message: 'Service unavailable',
  },
  [ServerErrorType.REQUEST_CONFLICT]: {
    message: 'Request Conflict',
  },
  [ServerErrorType.VALIDATION_ERROR]: {
    message: 'Validation Error',
  },
  [ServerErrorType.MISSING_WALLET]: {
    message: 'Missing Wallet',
  },
  [ServerErrorType.MISSING_USER]: {
    message: 'Missing User',
  },
  [ServerErrorType.MISSING_NOMINEE]: {
    message: 'Missing Nominee',
  },
  [ServerErrorType.MISSING_EXECUTOR]: {
    message: 'Missing Executor',
  },
  [ServerErrorType.MISSING_SESSION]: {
    message: 'Missing Session',
  },
  [ServerErrorType.INVALID_COUPON]: {
    message: 'Invalid Coupon',
  },
  [ServerErrorType.INVALID_SESSION]: {
    message: 'Invalid Session',
  },
  [ServerErrorType.INVALID_DEVICE]: {
    message: 'Invalid Device',
  },
  [ServerErrorType.INVALID_PRIVATE_KEY]: {
    message: 'Invalid Private Key',
  },
  [ServerErrorType.ACTIVE_PLAN_FOUND]: {
    message: 'Active Plan Found',
  },
  [ServerErrorType.OTP_RESEND_LIMIT]: {
    message: 'Otp Resend Limit',
  },
  [ServerErrorType.DUPLICATE_EMAIL]: {
    message: 'Duplicate Email',
  },
  [ServerErrorType.TRANSACTION_BROADCAST_FAILED]: {
    message: 'Transaction Broadcast Failed',
  },
};

export interface ServerErrorDetails {
  advanceText?: string;
  responseBody?: any;
  url?: string;
  status?: number;
}

export class ServerError extends Error {
  public code: string;

  public message: string;

  public details?: ServerErrorDetails;

  public isServerError = true;

  constructor(
    errorCode: ServerErrorType,
    message?: string,
    details?: ServerErrorDetails,
  ) {
    super();
    this.code = errorCode;
    this.message = message ?? serverErrorTypeDetails[errorCode].message;
    this.details = details;
  }

  public toJSON() {
    return {
      isServerError: this.isServerError,
      code: this.code,
      message: `${this.code}: ${this.message}`,
      ...(this.details ?? {}),
      stack: this.stack,
    };
  }
}
