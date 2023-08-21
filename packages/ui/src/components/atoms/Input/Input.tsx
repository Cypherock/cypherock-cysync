import React, { FC, ForwardedRef } from 'react';
import styled from 'styled-components';

import { InputLabel } from './InputLabel';

import { Button } from '../Button';
import { Flex } from '../Flex';
import { LangDisplay } from '../LangDisplay';
import { Typography } from '../Typography';

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
  $bgColor?: string;
  onClick?: () => void;
  pasteAllowed?: boolean;
  copyAllowed?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  postfixText?: string;
  $textColor?: string;
  $error?: boolean;
  leftImage?: React.ReactNode;
}

const InputStyle = styled.input<{
  $bgColor?: string;
  $textColor?: string;
  $error?: boolean;
  disabled: boolean;
}>`
  position: relative;
  width: 100%;
  border: none;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.palette.background.input};
  font-size: 16px;
  background: ${({ $bgColor, theme }) =>
    $bgColor ?? theme.palette.background.separatorSecondary};
  border: 1px solid
    ${({ theme, $error }) =>
      $error ? theme.palette.border.error : 'transparent'};
  border-radius: 8px;
  color: ${({ $textColor = 'muted', disabled, theme }) =>
    disabled
      ? 'theme.palette.background.disabled'
      : theme.palette.text[$textColor]};
  &:focus-visible {
    outline: none;
  }
  ::placeholder {
    line-height: 14px;
    color: ${({ disabled, theme }) =>
      disabled ? theme.palette.background.disabled : theme.palette.text.muted};
  }
`;

const InputWrapper = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.background.separatorSecondary};
  border: 1px solid ${({ theme }) => theme.palette.background.separator};
  input::-webkit-inner-spin-button,
  input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const PostfixIconStyle = styled.div`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
`;

export const Input: FC<InputProps & { ref?: ForwardedRef<HTMLInputElement> }> =
  React.forwardRef(
    (
      {
        placeholder = undefined,
        type,
        name,
        label = undefined,
        onChange = undefined,
        value = undefined,
        disabled = false,
        postfixText = undefined,
        $textColor = 'muted',
        postfixIcon = undefined,
        onPostfixIconClick = undefined,
        $bgColor = undefined,
        onClick = undefined,
        pasteAllowed = true,
        copyAllowed = true,
        onKeyDown = undefined,
        $error = false,
        leftImage,
      }: InputProps,
      ref: ForwardedRef<HTMLInputElement>,
    ) => (
      <Flex direction="column" width="full" align="center" justify="center">
        {label && (
          <InputLabel>
            <LangDisplay text={label} />
          </InputLabel>
        )}
        <InputWrapper>
          {leftImage}
          <InputStyle
            ref={ref}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            $bgColor={$bgColor}
            value={value}
            onClick={onClick}
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
            onChange={e => onChange?.(e.target.value)}
            onKeyDown={onKeyDown}
            $textColor={$textColor}
            $error={$error}
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
          {postfixText && (
            <PostfixIconStyle>
              <Typography color="muted">
                <LangDisplay text={postfixText} />
              </Typography>
            </PostfixIconStyle>
          )}
        </InputWrapper>
      </Flex>
    ),
  );

Input.defaultProps = {
  label: undefined,
  placeholder: undefined,
  postfixText: undefined,
  onChange: undefined,
  value: undefined,
  disabled: false,
  postfixIcon: undefined,
  onPostfixIconClick: undefined,
  $bgColor: undefined,
  onClick: undefined,
  pasteAllowed: true,
  copyAllowed: true,
  onKeyDown: undefined,
  $textColor: 'muted',
  $error: false,
  leftImage: undefined,
};

Input.displayName = 'Input';
