import React, { useMemo } from 'react';

export function useStateWithFinality<T>(
  initialState: T,
  finalState: T,
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [state, setState] = React.useState<T>(initialState);
  const isFinalState = useMemo(() => state >= finalState, [state]);
  return [state, setState, isFinalState];
}
