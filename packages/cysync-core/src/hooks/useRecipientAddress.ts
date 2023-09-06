import lodash from 'lodash';
import { useState, useEffect, useCallback } from 'react';

export const useRecipientAddress = (
  value?: string,
  onChange?: (val: string) => void,
  onDebounce?: (val: string) => Promise<void>,
) => {
  const [localValue, setLocalValue] = useState(value ?? '');
  const [showError, setShowError] = useState(false);
  const [isThrobberActive, setThrobberActive] = useState(false);

  const func = async (val: string) => {
    setThrobberActive(true);
    if (onDebounce) await onDebounce(val);
    if (onDebounce) setThrobberActive(false);
  };
  const debouncedFunction = useCallback(lodash.debounce(func, 300), []);

  const handleInputValueChange = async (val: string) => {
    if (val.trim() === 'hello') {
      setShowError(true);
    } else {
      setShowError(false);
    }

    setLocalValue(val);

    if (onChange) onChange(val);
    await debouncedFunction(val);
  };

  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(value);
    }
  }, [value]);

  const inputValue = value !== undefined ? value : localValue;

  return { inputValue, isThrobberActive, handleInputValueChange, showError };
};
