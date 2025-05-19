import { useEffect, useRef, useState } from 'react';

export const useCountdown = (time: number) => {
  const timeRef = useRef(time);

  useEffect(() => {
    timeRef.current = time;
  }, [time]);

  const [state, setState] = useState({
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => updateCountdown(), 1000);

    return () => clearInterval(interval);
  }, []);

  const updateCountdown = () => {
    const countdownDate = timeRef.current;

    console.log({ countdownDate, state });

    if (countdownDate) {
      const currentTime = new Date().getTime();

      const distanceToDate = countdownDate - currentTime;

      const seconds = Math.floor(distanceToDate / 1000);

      setState({ seconds });
    }
  };

  return state;
};
