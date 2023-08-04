import React, { useEffect, useState } from 'react';

import { Input as CypherockInput } from './Input';

interface InputWithDynamicPostfixProps {
  postfixIcon: React.ReactNode;
  onChange: (val: string) => void;
  text: string;
  throbber: React.ReactNode;
  $textColor?: string;
}

export const InputWithDynamicPostfix: React.FC<
  InputWithDynamicPostfixProps
> = ({ postfixIcon, onChange, text, throbber, $textColor }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (val: string) => {
    setInputValue(val);
    onChange(val);
  };

  useEffect(() => {
    if (inputValue.trim() !== '') {
      setInputValue('');
    }
  }, [inputValue]);

  return (
    <CypherockInput
      type="text"
      name="address"
      placeholder={text}
      postfixIcon={inputValue.trim() !== '' ? throbber : postfixIcon}
      onChange={handleInputChange}
      $textColor={$textColor}
    />
  );
};

InputWithDynamicPostfix.defaultProps = {
  $textColor: 'muted',
};

export default InputWithDynamicPostfix;
