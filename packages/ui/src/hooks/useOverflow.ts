import { useEffect, useRef, useState } from 'react';

interface UseOverflowProps {
  ofChild: boolean;
}

export const useOverflow = ({ ofChild = false }: UseOverflowProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const element = ofChild
      ? (ref.current?.firstChild as HTMLDivElement)
      : ref.current;
    if (!element) return undefined;

    const checkOverflow = () => {
      setIsOverflowing(element.scrollWidth > element.clientWidth);
    };

    checkOverflow();

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { ref, isOverflowing };
};
