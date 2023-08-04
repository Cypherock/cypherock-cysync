import { useEffect, useState } from 'react';

interface UseRecipientAddressProps {
  initialImage?: JSX.Element;
  throbber?: JSX.Element;
}

export function useRecipientAddress({
  initialImage,
  throbber,
}: UseRecipientAddressProps) {
  const [isInputChanged, setIsInputChanged] = useState(false);
  const [showError, setShowError] = useState(false);
  const [postfixIcon, setPostfixIcon] = useState(initialImage);

  const handleInputValueChange = (val: string) => {
    if (val.trim() === 'hello') {
      setShowError(true);
    } else {
      setShowError(false);
    }
    setIsInputChanged(val.trim() !== '');
  };

  useEffect(() => {
    if (isInputChanged) {
      setPostfixIcon(throbber);
      setTimeout(() => {
        setPostfixIcon(initialImage);
      }, 2000);
    } else {
      setPostfixIcon(initialImage);
    }
  }, [isInputChanged]);

  return {
    showError,
    postfixIcon,
    handleInputValueChange,
  };
}
