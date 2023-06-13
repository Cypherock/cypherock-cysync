import { DatabaseError, DatabaseErrorType } from '@cypherock/db-interfaces';
import { z } from 'zod';

const stringValidator = z.string();

const throwErrorIfNeeded = (
  name: string,
  result: z.SafeParseReturnType<any, any>,
) => {
  if (!result.success)
    throw new DatabaseError(
      DatabaseErrorType.INPUT_VALIDATION_FAILED,
      `invalid ${name} provided : ${result.error}`,
    );
};

export function validateStrings(key: string, value?: string) {
  let result = stringValidator.safeParse(key);
  throwErrorIfNeeded('index', result);
  if (value) {
    result = stringValidator.safeParse(value);
    throwErrorIfNeeded('index', result);
  }
}
