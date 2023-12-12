import { useEffect } from 'react';

type UseMockBehaviorProps = Record<string, (event: KeyboardEvent) => void>;

export const addKeyboardEvents = (props: UseMockBehaviorProps) => {
  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      for (const key in props) {
        if (
          Object.prototype.hasOwnProperty.call(props, key) &&
          event.key === key
        ) {
          event.preventDefault();
          props[key](event);
        }
      }
    };
    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []);
};
