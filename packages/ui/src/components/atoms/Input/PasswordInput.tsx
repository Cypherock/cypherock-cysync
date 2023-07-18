import React, { FC, useState } from 'react';
import { useTheme } from 'styled-components';

import { Input, InputProps } from './Input';

import { Visibility, VisibilityHide } from '../../../assets';

type PasswordInputProps = Omit<
  InputProps,
  'type' | 'postfixIcon' | 'postfixIconAlt' | 'onPostfixIconClick'
>;

export const PasswordInput: FC<PasswordInputProps> = props => {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const iconProps = {
    width: 26,
    height: 20,
    fill: theme!.palette.muted.main,
  };

  return (
    <Input
      type={showPassword ? 'text' : 'password'}
      {...props}
      copyAllowed={false}
      pasteAllowed={false}
      postfixIcon={
        showPassword ? (
          <Visibility {...iconProps} />
        ) : (
          <VisibilityHide {...iconProps} />
        )
      }
      onPostfixIconClick={togglePassword}
    />
  );
};
