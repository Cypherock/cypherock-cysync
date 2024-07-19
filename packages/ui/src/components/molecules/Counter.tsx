import React, { useState, useEffect } from 'react';

interface CounterProps {
  initialTimer: number;
  onTimerEnd: () => void;
}

const Counter: React.FC<CounterProps> = ({ initialTimer, onTimerEnd }) => {
  const [timer, setTimer] = useState(initialTimer);

  useEffect(() => {
    if (timer > 0) {
      const timeout = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearTimeout(timeout);
    }

    onTimerEnd();

    return undefined;
  }, [timer, onTimerEnd]);

  return <span>{timer}</span>;
};

export default Counter;
