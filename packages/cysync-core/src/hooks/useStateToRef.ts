import { useEffect, useRef } from 'react';

export function useStateToRef<T extends object>(params: T) {
  const ref = useRef<T>(params);

  useEffect(() => {
    ref.current = params;
  }, [params]);

  return ref;
}
