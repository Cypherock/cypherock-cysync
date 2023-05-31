import React, { useMemo } from 'react';

export function useStateWithFinality<T>(
  initialState: T,
  finalState: T,
): [T, (val: T | ((prev: T) => T)) => void, boolean] {
  const [state, setState] = React.useState<T>(initialState);
  const isFinalState = useMemo(() => state >= finalState, [state]);
  return [state, setState, isFinalState];
}
