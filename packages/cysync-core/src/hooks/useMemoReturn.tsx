import { useMemo } from 'react';

export function useMemoReturn<T extends Record<string, any>>(params: T) {
  return useMemo(() => params, [...Object.values(params)]);
}
