export enum ServerErrorType {
  UNKNOWN_ERROR = 'SER_0000',
  CONNOT_CONNECT = 'SER_0001',
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
