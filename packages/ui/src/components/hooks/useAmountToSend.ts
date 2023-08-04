import { useEffect, useState } from 'react';

interface UseAmountToSendProps {
  initialValue?: string;
  initialCoinState?: React.ReactNode | string;
  throbber?: React.ReactNode;
  isButtonEnabled?: (shouldActivate: boolean) => void;
}

export function useAmountToSend({
  initialCoinState,
  throbber,
  isButtonEnabled,
}: UseAmountToSendProps) {
  const [coinState, setCoinState] = useState<React.ReactNode | string>(
    initialCoinState,
  );
  const [textColor, setTextColor] = useState('muted');
  const [isInputChanged, setIsInputChanged] = useState(false);

  const handleInputValueChange = (val: string) => {
    if (val.trim() !== '') {
      setIsInputChanged(true);
      setTextColor('white');
    }
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isInputChanged) {
      setCoinState(throbber);
      timeoutId = setTimeout(() => {
        setCoinState(initialCoinState);
        if (isButtonEnabled) {
          isButtonEnabled(true);
        }
      }, 2000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isInputChanged]);

  return {
    coinState,
    textColor,
    handleInputValueChange,
  };
}
