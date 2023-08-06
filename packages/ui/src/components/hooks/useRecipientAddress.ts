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
    console.log('Inside hook value: ', val);
    console.log('onChange: ', onChange);
    if (val.trim() === 'hello') {
      setShowError(true);
    } else {
      setShowError(false);
    }

    setLocalValue(val);

    if (onChange) {
      onChange(val);
    }

    setIsInputChanged(val.trim() !== '');
  };

  useEffect(() => {
    if (isInputChanged) {
      setThrobberActive(true);
      console.log(
        'useEffect isInputChanged: ',
        isInputChanged,
        ', ',
        localValue,
      );
      setTimeout(() => {
        setThrobberActive(false);
      }, 2000);
    } else {
      setThrobberActive(false);
    }
  }, [isInputChanged]);

  useEffect(() => {
    if (value !== undefined) {
      console.log('useffect value: ', value);
      setLocalValue(value);
    }
  }, [value]);

  const inputValue = value !== undefined ? value : localValue;
  useEffect(() => {
    console.log('Input value changed:', inputValue);
  }, [inputValue]);

  console.log('final input value ', value, inputValue);
  return { inputValue, isThrobberActive, handleInputValueChange, showError };
};
