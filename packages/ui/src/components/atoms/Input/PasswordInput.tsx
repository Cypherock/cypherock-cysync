import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Input } from './Input';

interface PasswordInputProps {
  placeholder: string;
}

interface EyeImageStyleProps {
  type: string;
}

const EyeImageStyle = styled.div<EyeImageStyleProps>`
  height: 20px;
  width: 20px;
`;

const PasswordInputStyle = styled.div`
  width: 100%;
  .image-pass {
    position: absolute;
    right: 24px;
    bottom: 32px;
  }
`;

export const PasswordInput: FC<PasswordInputProps> = ({ placeholder }) => {
  // states
  const [passwordType, setPasswordType] = useState('password');

  // functions
  const togglePassword = () => {
    if (passwordType === 'password') {
      setPasswordType('text');
    } else {
      setPasswordType('password');
    }
  };

  return (
    <PasswordInputStyle>
      <Input type={passwordType} placeholder={placeholder} />
      <EyeImageStyle
        className="image-pass"
        onClick={togglePassword}
        type={passwordType}
      />
    </PasswordInputStyle>
  );
};
