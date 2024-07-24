import { AxiosError } from 'axios';

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
