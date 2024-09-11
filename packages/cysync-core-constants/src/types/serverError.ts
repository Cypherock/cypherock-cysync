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
  OTP_EXPIRED = 'SER_1010',
  PAYLOAD_VALIDATION_ERROR = 'SER_1011',
  MAX_RETRIES_EXCEEDED = 'SER_1012',
  ACCOUNT_LOCKED = 'SER_1013',
  SERVICE_UNAVAILABLE = 'SER_1014',
  REQUEST_CONFLICT = 'SER_1015',
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
