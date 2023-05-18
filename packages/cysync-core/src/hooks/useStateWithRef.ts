import React, { useRef, useState } from 'react';

export function useStateWithRef<T>(
  initialState: T,
): [T, (val: T) => void, React.MutableRefObject<T>] {
  const [state, setState] = useState<T>(initialState);
  const stateRef = useRef<T>(initialState);

  const overrideSetState = (val: T) => {
    stateRef.current = val;
    setState(val);
  };

  return [state, overrideSetState, stateRef];
}
