import React, { FC, useState } from 'react';

import { Input, InputProps } from './Input';

import { Visibility, VisibilityHide } from '../../../assets';

type PasswordInputProps = Omit<
  InputProps,
  'type' | 'postfixIcon' | 'postfixIconAlt' | 'onPostfixIconClick'
>;

export const PasswordInput: FC<PasswordInputProps> = props => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Input
      type={showPassword ? 'text' : 'password'}
      {...props}
      copyAllowed={false}
      pasteAllowed={false}
      PostfixIcon={showPassword ? Visibility : VisibilityHide}
      onPostfixIconClick={togglePassword}
    />
  );
};
