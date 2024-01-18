import React from 'react';

import { CustomInputSend } from './RecipientAddress';

import { Input, Typography } from '../../atoms';

interface FeesInputProps {
  value: string;
  onChange: (val: string) => void;
  postfixText?: string;
}

export const FeesInput: React.FC<FeesInputProps> = ({
  value,
  postfixText,
  onChange,
}) => (
  <CustomInputSend>
    <Input
      type="number"
      name="fees"
      value={value}
      $textColor="white"
      onChange={onChange}
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

FeesInput.defaultProps = {
  postfixText: '',
};
