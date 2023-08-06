import { useState } from 'react';

export const useButtonState = (): [
  boolean,
  (shouldActivate: boolean) => void,
] => {
  const [btnState, setBtnState] = useState(false);

  const handleButtonState = (shouldActivate: boolean) => {
    setBtnState(shouldActivate);
  };

  return [btnState, handleButtonState];
};
