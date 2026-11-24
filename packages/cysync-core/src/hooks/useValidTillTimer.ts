import { useEffect, useRef, useState } from 'react';

const getRemainingSeconds = (validTill?: string) => {
  if (!validTill) return 0;
  const diff = new Date(validTill).getTime() - Date.now();
  return Math.max(0, Math.floor(diff / 1000));
};

/**
 * Counts down to `validTill` (an ISO date string) and calls `onExpire` once
 * when it is reached. A new `validTill` restarts the countdown.
 */
export const useValidTillTimer = (
  validTill: string | undefined,
  onExpire?: () => void,
) => {
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(validTill),
  );

  // Kept in a ref so the latest callback (with the latest state) is used
  // without restarting the countdown on every render
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setRemainingSeconds(getRemainingSeconds(validTill));
    if (!validTill) return undefined;

    let hasExpired = false;
    const interval = setInterval(() => {
      const remaining = getRemainingSeconds(validTill);
      setRemainingSeconds(remaining);

      if (remaining === 0 && !hasExpired) {
        hasExpired = true;
        clearInterval(interval);
        onExpireRef.current?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [validTill]);

  return {
    remainingSeconds,
    minutes: Math.floor(remainingSeconds / 60)
      .toString()
      .padStart(2, '0'),
    seconds: (remainingSeconds % 60).toString().padStart(2, '0'),
  };
};
