import React, { useState } from 'react';

import { CustomInputSend } from './RecipientAddress';

import { Input, Typography } from '../../atoms';

interface FeesInputProps {
  value: string;
  postfixText?: string;
}

export const FeesInput: React.FC<FeesInputProps> = ({ value, postfixText }) => {
  const [inputValue, setInputValue] = useState(value);

  const filterNumericInput = (val: string) => val.replace(/[^0-9.]/g, '');
  const handleInputChange = (newValue: string) => {
    const filteredValue = filterNumericInput(newValue);
    setInputValue(filteredValue);
  };

  return (
    <CustomInputSend>
      <Input
        type="text"
        name="address"
        value={inputValue}
        $textColor="white"
        onChange={handleInputChange}
        $noBorder
      />

      {postfixText !== '' ? (
        <Typography
          $fontSize={16}
          color="muted"
          $allowOverflow
          $whiteSpace="nowrap"
          $textOverflow="ellipsis"
        >
          {postfixText}
        </Typography>
      ) : undefined}
    </CustomInputSend>
  );
};

FeesInput.defaultProps = {
  postfixText: '',
};
