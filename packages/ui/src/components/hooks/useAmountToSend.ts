import { useState, useEffect } from 'react';

import { useToggle } from './useToggle';

interface UseAmountToSendProps {
  coin: React.ReactNode | string;
  onChange?: (val: string) => void;
  isButtonEnabled?: (shouldActivate: boolean) => void;
  throbber?: JSX.Element | undefined;
  value: string;
}

export const useAmountToSend = ({
  coin,
  onChange,
  isButtonEnabled,
  throbber,
  value,
}: UseAmountToSendProps) => {
  const [coinState, setCoinState] = useState<React.ReactNode | string>(coin);
  const [textColor, setTextColor] = useState('muted');
  const [isInputChanged, setIsInputChanged] = useState(false);
  const { isChecked: isCheckedMax, handleToggleChange: handleToggleMax } =
    useToggle();

  const handleInputValueChange = (val: string) => {
    setIsInputChanged(val.trim() !== '');
    setTextColor(val.trim() !== '' ? 'white' : 'muted');
    if (onChange) onChange(val);
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isInputChanged) {
      setCoinState(throbber);
      timeoutId = setTimeout(() => {
        setCoinState(coin);
        if (isButtonEnabled) {
          isButtonEnabled(true);
        }
      }, 2000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isInputChanged, coin, isButtonEnabled]);

  useEffect(() => {
    if (value.trim() !== '' && parseFloat(value) !== 0) {
      setTextColor('white');
    } else {
      setTextColor('muted');
    }
  }, [value]);

  return {
    coinState,
    textColor,
    isCheckedMax,
    handleToggleMax,
    handleInputValueChange,
    value,
  };
};
