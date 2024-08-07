import { useCallback, useState } from 'react';

export function useAsync<T extends any[]>(
  callback: (...params: T) => Promise<boolean>,
  onError?: (e?: any) => void,
) {
  const [isLoading, setIsLoading] = useState(false);

  const run = useCallback(
    async (...params: T) => {
      setIsLoading(true);

      let result: boolean | undefined;
      try {
        result = await callback(...params);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        if (onError) {
          onError(error);
        }
        result = false;
      }

      return result;
    },
    [callback, onError],
  );

  return [run, isLoading] as const;
}
