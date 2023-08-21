import React, { useState } from 'react';

import { Input } from '../../atoms';

interface FeesInputProps {
  value: string;
  postfixText: string;
}

export const FeesInput: React.FC<FeesInputProps> = ({ value, postfixText }) => {
  const [inputValue, setInputValue] = useState(value);

  return (
    <Input
      type="text"
      name="address"
      value={inputValue}
      $textColor="white"
      onChange={newValue => setInputValue(newValue)}
      postfixText={postfixText}
    />
  );
};
