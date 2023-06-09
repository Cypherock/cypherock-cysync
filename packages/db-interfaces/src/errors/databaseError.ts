export enum DatabaseErrorType {
  UNKNOWN_ERROR = 'DB_0000',

  DATABASE_CREATION_FAILED = 'DB_0100',
  DATABASE_CLOSED = 'DB_0101',
  DATABASE_NOT_LOADED = 'DB_0102',

  INPUT_VALIDATION_FAILED = 'DB_0200',
  VERSION_NOT_SPECIFIED = 'DB_0201',

  INSERT_FAILED = 'DB_0300',
  UPDATE_FAILED = 'DB_0301',
  GET_FAILED = 'DB_0302',
  REMOVE_FAILED = 'DB_0303',

  INVALID_PARAMETER_PROVIDED = 'DB_0400',
}

type CodeToErrorMap = {
  [property in DatabaseErrorType]: {
    message: string;
  };
};

export const databaseErrorTypeDetails: CodeToErrorMap = {
  [DatabaseErrorType.UNKNOWN_ERROR]: {
    message: 'Unknown database error',
  },
  [DatabaseErrorType.DATABASE_CREATION_FAILED]: {
    message: "Can't create database instance",
  },
  [DatabaseErrorType.DATABASE_CLOSED]: {
    message: 'Database instance was closed',
  },
  [DatabaseErrorType.DATABASE_NOT_LOADED]: {
    message: 'Database is not loaded',
  },
  [DatabaseErrorType.INPUT_VALIDATION_FAILED]: {
    message: 'The parameters provided do not satisfy the requirements',
  },
  [DatabaseErrorType.VERSION_NOT_SPECIFIED]: {
    message: 'No version specified in object or in repository',
  },
  [DatabaseErrorType.INSERT_FAILED]: {
    message: 'Could not insert the given data',
  },
  [DatabaseErrorType.UPDATE_FAILED]: {
    message: 'Could not update the given data',
  },
  [DatabaseErrorType.GET_FAILED]: {
    message: 'Could not fetch the data',
  },
  [DatabaseErrorType.REMOVE_FAILED]: {
    message: 'Could not remove any data',
  },
  [DatabaseErrorType.INVALID_PARAMETER_PROVIDED]: {
    message: 'The parameter provided had some invalid field(s)',
  },
};

export class DatabaseError extends Error {
  public code: string;

  public message: string;

  public isDatabaseError = true;

  constructor(errorCode: DatabaseErrorType, message?: string) {
    super();
    this.code = errorCode;
    this.message = message ?? databaseErrorTypeDetails[errorCode].message;
  }

  public toJSON() {
    return {
      isDatabaseError: this.isDatabaseError,
      code: this.code,
      message: `${this.code}: ${this.message}`,
      stack: this.stack,
    };
  }
}
