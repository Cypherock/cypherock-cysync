import { useEffect, useRef } from 'react';

export const useCallbackAfterCountdown = (
  callback: () => void,
  countdown: number,
) => {
  const timeout = useRef<NodeJS.Timeout>();
  const callbackRef = useRef(callback);
  const startTimeRef = useRef<number | undefined>();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const start = () => {
    const timePassed = startTimeRef.current
      ? Date.now() - startTimeRef.current
      : 0;

    if (timePassed < countdown) {
      timeout.current = setTimeout(() => {
        callbackRef.current();
      }, countdown - timePassed);
    } else {
      callbackRef.current();
    }
  };

  const stop = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  };

  const setStartTime = (time?: number) => {
    startTimeRef.current = time;
  };

  return {
    setStartTime,
    start,
    stop,
  };
};
