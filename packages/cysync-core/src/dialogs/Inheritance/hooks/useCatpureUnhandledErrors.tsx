import { useState } from 'react';

export const useCaptureUnhandledErrors = () => {
  const [unhandledError, setUnhandledError] = useState<any>();

  function captureErrors<T extends (...args: any[]) => Promise<any>>(fn: T): T {
    return async function (
      ...args: Parameters<T>
    ): Promise<ReturnType<T> | void> {
      try {
        return await fn(...args);
      } catch (error) {
        setUnhandledError(error);
      }
      return undefined;
    } as T;
  }

  return {
    unhandledError,
    setUnhandledError,
    captureErrors,
  };
};
