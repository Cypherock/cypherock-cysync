import React, { FC } from 'react';
import styled from 'styled-components';

import { InputLabel } from './InputLabel';

import { Button } from '../Button';
import { Flex } from '../Flex';
import { LangDisplay } from '../LangDisplay';

export interface InputProps {
  type: string;
  placeholder?: string;
  name: string;
  label?: string;
  onChange?: (val: string) => void;
  value?: string;
  disabled?: boolean;
  postfixIcon?: React.ReactNode;
  onPostfixIconClick?: () => void;
  pasteAllowed?: boolean;
  copyAllowed?: boolean;
}

const InputStyle = styled.input`
  position: relative;
  width: 100%;
  border: none;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.palette.background.input};
  font-size: 16px;
  background: #272320;
  border: 1px solid #39322c;
  border-radius: 8px;
  color: ${({ theme }) => theme.palette.text.muted};

  &:focus-visible {
    outline: none;
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const PostfixIconStyle = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
`;

export const Input: FC<InputProps> = ({
  placeholder,
  type,
  name,
  label,
  onChange,
  value,
  disabled,
  postfixIcon,
  onPostfixIconClick,
  pasteAllowed,
  copyAllowed,
}) => (
  <Flex direction="column" width="full" align="center" justify="center">
    {label && (
      <InputLabel>
        <LangDisplay text={label} />
      </InputLabel>
    )}
    <InputWrapper>
      <InputStyle
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onPaste={e => {
          if (pasteAllowed) return true;
          e.preventDefault();
          return false;
        }}
        onCopy={e => {
          if (copyAllowed) return true;
          e.preventDefault();
          return false;
        }}
        onChange={e => onChange && onChange(e.target.value)}
      />
      {postfixIcon && (
        <PostfixIconStyle>
          <Button
            type="button"
            variant="none"
            display="flex"
            onClick={onPostfixIconClick}
          >
            {postfixIcon}
          </Button>
        </PostfixIconStyle>
      )}
    </InputWrapper>
  </Flex>
);

Input.defaultProps = {
  label: undefined,
  placeholder: undefined,
  onChange: undefined,
  value: undefined,
  disabled: false,
  postfixIcon: undefined,
  onPostfixIconClick: undefined,
  pasteAllowed: true,
  copyAllowed: true,
};
