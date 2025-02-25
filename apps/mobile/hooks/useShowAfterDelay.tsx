import { useEffect, useState } from 'react';

export default function useShowAfterDelay() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(true);
    }, 5);
    return () => clearTimeout(timeout);
  }, []);
  return show;
}
