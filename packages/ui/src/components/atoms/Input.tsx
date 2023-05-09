/* eslint-disable react/no-unused-prop-types */
import React, { useState, ReactNode } from 'react';
import styled from 'styled-components';
// import passwordHide from "@assets/images/onboarding/setPass/password-hide.png";
// import copy from "@assets/images/copy.png";
// import check from "@assets/images/check.png";

export interface InputProps {
  children?: ReactNode;
  type?: string;
  placeholder?: string;
}

interface EyeImageStyleProps {
  type: string;
}

interface CopyImageStyleProps {
  isCopied: boolean;
}

export const InputContainerStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  position: relative;
  img {
    position: absolute;
    right: 24px;
    bottom: 32px;
  }
`;

export const InputLabelStyle = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.textMuted};
  margin: ${({ theme }) => theme.spacing.one.spacing};
  letter-spacing: 0.12em;
`;

export const InputStyle = styled.input`
  position: relative;
  width: 100%;
  border: none;
  padding-top: ${({ theme }) => theme.spacing.two.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.two.spacing};
  padding-left: ${({ theme }) => theme.spacing.three.spacing};
  padding-right: ${({ theme }) => theme.spacing.three.spacing};
  background-color: ${({ theme }) => theme.palette.background.inputBackground};
  border-radius: ${({ theme }) => theme.spacing.one.spacing};
  font-size: ${({ theme }) => theme.spacing.two.spacing};
  margin-bottom: ${({ theme }) => theme.spacing.two.spacing};
  color: white;
  ::placeholder {
    font-weight: 300;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.12em;
    color: #8b8682;
  }
`;

export const SearchBarStyle = styled.input`
  width: 100%;
  border: 1px solid #39322c;
  padding-top: ${({ theme }) => theme.spacing.two.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.two.spacing};
  padding-left: ${({ theme }) => theme.spacing.three.spacing};
  padding-right: ${({ theme }) => theme.spacing.three.spacing};
  background-color: ${({ theme }) => theme.palette.background.inputBackground};
  border-radius: ${({ theme }) => theme.spacing.one.spacing};
  color: ${({ theme }) => theme.palette.text.mutedText};
  font-size: ${({ theme }) => theme.spacing.two.spacing};
  ::placeholder {
    color: ${({ theme }) => theme.palette.text.textMutted};
  }
`;

export const InputTextAreaStyle = styled.textarea`
  position: relative;
  width: 100%;
  border: none;
  padding-top: ${({ theme }) => theme.spacing.two.spacing};
  padding-bottom: ${({ theme }) => theme.spacing.two.spacing};
  padding-left: ${({ theme }) => theme.spacing.three.spacing};
  padding-right: ${({ theme }) => theme.spacing.three.spacing};
  background-color: ${({ theme }) => theme.palette.background.inputBackground};
  border-radius: ${({ theme }) => theme.spacing.one.spacing};
  font-size: ${({ theme }) => theme.spacing.two.spacing};
  margin-bottom: ${({ theme }) => theme.spacing.two.spacing};
  color: white;
  height: 182px;
  ::placeholder {
    font-weight: 300;
    font-size: 14px;
    line-height: 21px;
    color: #8b8682;
  }
`;

// TODO: change the image for password show
export const EyeImageStyle = styled.div<EyeImageStyleProps>`
  height: 20px;
  width: 20px;
`;

export const InputPasswordStyle = styled.div`
  width: 100%;
  .image-pass {
    position: absolute;
    right: 24px;
    bottom: 32px;
  }
`;

export const ClipboardBarStyle = styled.div`
  position: relative;
  width: 100%;
  .image-copy {
    position: absolute;
    right: 24px;
    bottom: 16px;
  }
`;

export const CopyImageStyle = styled.div<CopyImageStyleProps>`
  height: 20px;
  width: 25px;
`;

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

Input.defaultProps = {
  children: null,
  type: '',
  placeholder: '',
};
InputLabel.defaultProps = {
  children: null,
  type: '',
  placeholder: '',
};
InputTextArea.defaultProps = {
  children: null,
  type: '',
  placeholder: '',
};
InputContainer.defaultProps = {
  children: null,
  type: '',
  placeholder: '',
};
InputPassword.defaultProps = {
  children: null,
  type: '',
  placeholder: '',
};
SearchBar.defaultProps = {
  children: null,
  type: '',
  placeholder: '',
};
ClipboardBar.defaultProps = {
  children: null,
  type: '',
  placeholder: '',
};
