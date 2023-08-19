import React from 'react';
import { Input } from '../../atoms';

interface FeesInputProps {
  value: string;
  postfixText: string;
}

export const FeesInput: React.FC<FeesInputProps> = ({ value, postfixText }) => (
  <Input
    type="text"
    name="address"
    value={value}
    $textColor="white"
    postfixText={postfixText}
  />
);
