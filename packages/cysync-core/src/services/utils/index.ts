import { ServerError, ServerErrorType } from '@cypherock/cysync-core-constants';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { createServerErrorFromError } from '~/utils';

export const serverErrorCodeMap: Record<number, ServerErrorType | undefined> = {
  1001: ServerErrorType.OTP_VERIFICATION_FAILED,
  1003: ServerErrorType.LOGIN_FAILED,
  1004: ServerErrorType.SIGNATURE_VERIFICATION_FAILED,
  1005: ServerErrorType.INVALID_REQUEST,
  1006: ServerErrorType.UNAUTHORIZED_ACCESS,
  1007: ServerErrorType.RESOURCE_NOT_FOUND,
  1008: ServerErrorType.INTERNAL_SERVER_ERROR,
  1009: ServerErrorType.REQUEST_TIMEOUT,
  1010: ServerErrorType.OTP_EXPIRED,
  1011: ServerErrorType.PAYLOAD_VALIDATION_ERROR,
  1012: ServerErrorType.MAX_RETRIES_EXCEEDED,
  1013: ServerErrorType.ACCOUNT_LOCKED,
  1014: ServerErrorType.SERVICE_UNAVAILABLE,
  1015: ServerErrorType.REQUEST_CONFLICT,
};

export type Only<T, U> = {
  [P in keyof T]: T[P];
} & {
  [P in keyof U]?: never;
};

export type Either<T, U> = Only<T, U> | Only<U, T>;

export interface ServerErrorResponse {
  error: ServerError;
}

export interface ServerResultResponse<T> {
  result: T;
}

export type ServerResponseWithError<T> = Either<
  ServerErrorResponse,
  ServerResultResponse<T>
>;

export async function runAndHandleServerErrors<T>(
  callback: () => Promise<T>,
): Promise<ServerResponseWithError<T>> {
  try {
    const result = await callback();
    return {
      result,
    };
  } catch (error) {
    if ((error as any)?.isAxiosError) {
      const e = error as AxiosError;

      if ((e.response?.data as any).code) {
        const { code } = e.response?.data as any;
        const errorType =
          serverErrorCodeMap[code] ?? ServerErrorType.UNKNOWN_ERROR;
        const serverError =
          createServerErrorFromError(e, errorType) ??
          new ServerError(ServerErrorType.UNKNOWN_ERROR);

        return {
          error: serverError,
        };
      }
    }

    throw error;
  }
}

export async function makePostRequest<T>(
  schema: Zod.Schema<T>,
  url: string,
  data: any,
  config?: AxiosRequestConfig,
) {
  const response = await axios.post(url, data, config);
  const result = schema.parse(response.data);
  return result;
}
