import { useState } from 'react';

export const useToggle = (initialValue = false) => {
  const [isChecked, setIsChecked] = useState(initialValue);

  const handleToggleChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  return { isChecked, handleToggleChange };
};
