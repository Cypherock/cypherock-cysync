import { useState } from 'react';

export const useToggleState = (initialValue = false) => {
  const [isChecked, setIsChecked] = useState(initialValue);

  const handleToggleChange = () => {
    setIsChecked(prevValue => !prevValue);
  };

  return { isChecked, handleToggleChange };
};

export default useToggleState;
