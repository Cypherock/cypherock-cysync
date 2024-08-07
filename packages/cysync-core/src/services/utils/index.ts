import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export interface WithServerError<T> {
  error?: string;
  result?: T;
}

export async function runAndHandleServerErrors<T>(
  callback: () => Promise<T>,
): Promise<WithServerError<T>> {
  try {
    const result = await callback();
    return {
      result,
    };
  } catch (error) {
    if ((error as any)?.isAxiosError) {
      const e = error as AxiosError;

      if ((e.response?.data as any).cysyncError) {
        return {
          error: (e.response?.data as any).cysyncError,
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
