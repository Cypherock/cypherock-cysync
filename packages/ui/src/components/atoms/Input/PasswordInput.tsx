import React, { FC, useState } from 'react';
import { Input, InputProps } from './Input';
import { visibilityHideIcon, visibilityIcon } from '../../../assets';

interface PasswordInputProps
  extends Omit<
    InputProps,
    'type' | 'postfixIcon' | 'postfixIconAlt' | 'onPostfixIconClick'
  > {}

export const PasswordInput: FC<PasswordInputProps> = props => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Input
      type={showPassword ? 'text' : 'password'}
      {...props}
      postfixIcon={showPassword ? visibilityHideIcon : visibilityIcon}
      postfixIconAlt="Show password"
      onPostfixIconClick={togglePassword}
    />
  );
};
