import { useState, useEffect } from 'react';

import { useToggle } from './useToggle';

interface UseAmountToSendProps {
  coin: React.ReactNode | string;
  onChange?: (val: string) => void;
  isButtonEnabled?: (shouldActivate: boolean) => void;
  throbber?: JSX.Element | undefined;
  coinValue: string;
  dollarValue: string;
}

export const useAmountToSend = ({
  coin,
  onChange,
  isButtonEnabled,
  throbber,
  coinValue: initialCoinValue = '',
  dollarValue: initialDollarValue = '',
}: UseAmountToSendProps) => {
  const [coinState, setCoinState] = useState<React.ReactNode | string>(coin);
  const [coinValue, setCoinValue] = useState<string>(initialCoinValue);
  const [dollarValue, setDollarValue] = useState<string>(initialDollarValue);
  const [isInputChanged, setIsInputChanged] = useState(false);
  const [coinTextColor, setCoinTextColor] = useState('muted');
  const [dollarTextColor, setDollarTextColor] = useState('muted');

  const { isChecked: isCheckedMax, handleToggleChange: handleToggleMax } =
    useToggle();

  const filterNumericInput = (val: string) => val.replace(/[^0-9.]/g, '');
  const handleCoinValueChange = (val: string) => {
    const filteredValue = filterNumericInput(val);
    setIsInputChanged(filteredValue.trim() !== '');
    setCoinTextColor(filteredValue.trim() !== '' ? 'white' : 'muted');
    setCoinValue(filteredValue);
    if (onChange) onChange(filteredValue);
  };

  // Similarly for dollar value
  const handleDollarValueChange = (val: string) => {
    const filteredValue = filterNumericInput(val);
    setIsInputChanged(filteredValue.trim() !== '');
    setDollarTextColor(filteredValue.trim() !== '' ? 'white' : 'muted');
    setDollarValue(filteredValue);
    if (onChange) onChange(filteredValue);
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
    if (coinValue.trim() !== '' && parseFloat(coinValue) !== 0) {
      setCoinTextColor('white');
    } else {
      setCoinTextColor('muted');
    }
  }, [coinValue]);

  useEffect(() => {
    if (dollarValue.trim() !== '' && parseFloat(dollarValue) !== 0) {
      setDollarTextColor('white');
    } else {
      setDollarTextColor('muted');
    }
  }, [dollarValue]);

  return {
    coinState,
    isCheckedMax,
    handleToggleMax,
    handleCoinValueChange,
    handleDollarValueChange,
    coinValue,
    dollarValue,
    coinTextColor,
    dollarTextColor,
  };
};
