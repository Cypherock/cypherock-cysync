import React, { useState } from 'react';
import {
  InputContainerStyle,
  InputLabelStyle,
  InputStyle,
  InputProps,
  SearchBarStyle,
  InputTextAreaStyle,
  InputPasswordStyle,
  EyeImageStyle,
  ClipboardBarStyle,
  CopyImageStyle,
} from './Input.styled';

export const InputLabel = ({ children }: InputProps) => (
  <InputLabelStyle>{children}</InputLabelStyle>
);

export const Input = ({ placeholder, type }: InputProps) => (
  <InputStyle type={type} placeholder={placeholder} />
);

export const InputTextArea = ({ placeholder }: InputProps) => (
  <InputTextAreaStyle placeholder={placeholder} />
);

export const InputContainer = ({ children }: InputProps) => (
  <InputContainerStyle>{children}</InputContainerStyle>
);

export const SearchBar = ({ placeholder }: InputProps) => (
  <SearchBarStyle placeholder={placeholder} />
);

export const InputPassword = ({ placeholder }: InputProps) => {
  const [passwordType, setPasswordType] = useState('password');
  const togglePassword = () => {
    if (passwordType === 'password') {
      setPasswordType('text');
    } else {
      setPasswordType('password');
    }
  };
  return (
    <InputPasswordStyle>
      <Input type={passwordType} placeholder={placeholder} />
      <EyeImageStyle
        className="image-pass"
        onClick={togglePassword}
        type={passwordType}
      />
    </InputPasswordStyle>
  );
};

export const ClipboardBar = ({ placeholder }: InputProps) => {
  // states
  const [isCopied, setIsCopied] = useState(false);

  // functions
  const toggleCopied = () => {
    if (placeholder) {
      navigator.clipboard.writeText(placeholder);
      setIsCopied(true);
    }
  };
  return (
    <ClipboardBarStyle>
      <SearchBarStyle placeholder={placeholder} />
      <CopyImageStyle
        className="image-copy"
        onClick={toggleCopied}
        isCopied={isCopied}
      />
    </ClipboardBarStyle>
  );
};
