import { useCallback, useState } from 'react';

export const useAsyncError = () => {
  const [, setError] = useState();
  return useCallback(
    (e: any) => {
      setError(() => {
        throw e;
      });
    },
    [setError],
  );
};
