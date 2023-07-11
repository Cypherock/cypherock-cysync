import React, { FC } from 'react';
import styled from 'styled-components';

import { InputLabel } from './InputLabel';

import { Button } from '../Button';
import { Flex } from '../Flex';
import { Image } from '../Image';
import { LangDisplay } from '../LangDisplay';

export interface InputProps {
  type: string;
  placeholder?: string;
  name: string;
  label?: string;
  onChange?: (val: string) => void;
  value?: string;
  disabled?: boolean;
  postfixIcon?: string;
  postfixIconAlt?: string;
  onPostfixIconClick?: () => void;
  bgColor?: string;
  onClick?: () => void;
}

const InputStyle = styled.input<{ bgColor?: string }>`
  position: relative;
  width: 100%;
  border: none;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.palette.background.input};
  font-size: 16px;
  background: ${({ bgColor }) => bgColor ?? '#272320'};
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
  bgColor,
  onClick,
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
        bgColor={bgColor}
        value={value}
        onClick={onClick}
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
  </Flex>
);

Input.defaultProps = {
  label: undefined,
  placeholder: undefined,
  onChange: undefined,
  value: undefined,
  disabled: false,
  postfixIcon: undefined,
  postfixIconAlt: undefined,
  onPostfixIconClick: undefined,
  bgColor: undefined,
  onClick: undefined,
};
