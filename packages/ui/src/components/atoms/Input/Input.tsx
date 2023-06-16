import React, { FC } from 'react';
import styled from 'styled-components';
import { Button } from '../Button';
import { LangDisplay } from '../LangDisplay';
import { Image } from '../Image';
import { InputLabel } from './InputLabel';

export interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  label?: string;
  onChange?: (val: string) => void;
  value?: string;
  disabled?: boolean;
  postfixIcon?: string;
  postfixIconAlt?: string;
  onPostfixIconClick?: () => void;
}

const InputStyle = styled.input`
  position: relative;
  width: 100%;
  border: none;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.palette.background.inputBackground};
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

const PostfixIcon = styled.div`
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
  postfixIconAlt,
  onPostfixIconClick,
}) => (
  <>
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
        onChange={e => onChange && onChange(e.target.value)}
      />
      {postfixIcon && postfixIconAlt && (
        <PostfixIcon>
          <Button
            type="button"
            variant="none"
            display="flex"
            onClick={onPostfixIconClick}
          >
            <Image src={postfixIcon} alt={postfixIconAlt} height={20} />
          </Button>
        </PostfixIcon>
      )}
    </InputWrapper>
  </>
);

Input.defaultProps = {
  label: undefined,
  onChange: undefined,
  value: undefined,
  disabled: false,
  postfixIcon: undefined,
  postfixIconAlt: undefined,
  onPostfixIconClick: undefined,
};
