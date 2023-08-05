import { useState, useEffect } from 'react';

export const useRecipientAddress = (
  value?: string,
  onChange?: (val: string) => void,
) => {
  const [localValue, setLocalValue] = useState(value ?? '');
  const [isInputChanged, setIsInputChanged] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isThrobberActive, setThrobberActive] = useState(false);

  const handleInputValueChange = (val: string) => {
    if (val.trim() === 'hello') {
      setShowError(true);
    } else {
      setShowError(false);
    }

    if (value === undefined) {
      setLocalValue(val);
    }

    if (onChange) {
      onChange(val);
    }

    setIsInputChanged(val.trim() !== '');
  };

  useEffect(() => {
    if (isInputChanged) {
      setThrobberActive(true);
      setTimeout(() => {
        setThrobberActive(false);
      }, 2000);
    } else {
      setThrobberActive(false);
    }
  }, [isInputChanged]);

  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);

  const inputValue = value !== undefined ? value : localValue;

  return { inputValue, isThrobberActive, handleInputValueChange, showError };
};
