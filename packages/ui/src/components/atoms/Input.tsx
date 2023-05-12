/* eslint-disable react/no-unused-prop-types */
import React, { useState, ReactNode, FC } from 'react';
import styled from 'styled-components';

interface InputProps {
  children?: ReactNode;
  type?: string;
  placeholder?: string;
}

interface EyeImageStyleProps {
  type: string;
}

const InputContainerStyle = styled.div`
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

const InputLabelStyle = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.palette.text.textMuted};
  margin: ${({ theme }) => theme.spacing.one.spacing};
  letter-spacing: 0.12em;
`;

const InputStyle = styled.input`
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

const InputTextAreaStyle = styled.textarea`
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
const EyeImageStyle = styled.div<EyeImageStyleProps>`
  height: 20px;
  width: 20px;
`;

const InputPasswordStyle = styled.div`
  width: 100%;
  .image-pass {
    position: absolute;
    right: 24px;
    bottom: 32px;
  }
`;

export const InputLabel: FC<InputProps> = ({ children }) => (
  <InputLabelStyle>{children}</InputLabelStyle>
);

export const Input: FC<InputProps> = ({ placeholder, type }) => (
  <InputStyle type={type} placeholder={placeholder} />
);

export const InputTextArea: FC<InputProps> = ({ placeholder }) => (
  <InputTextAreaStyle placeholder={placeholder} />
);

export const InputContainer: FC<InputProps> = ({ children }) => (
  <InputContainerStyle>{children}</InputContainerStyle>
);

export const SearchBar: FC<InputProps> = ({ placeholder }) => (
  <SearchBarStyle placeholder={placeholder} />
);

export const InputPassword: FC<InputProps> = ({ placeholder }) => {
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
