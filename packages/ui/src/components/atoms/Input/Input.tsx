import React, { FC, ForwardedRef } from 'react';
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
  $bgColor?: string;
  onClick?: () => void;
  pasteAllowed?: boolean;
  copyAllowed?: boolean;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  leftImage?: React.ReactNode;
  $customImageSpacing?: boolean;
}

const InputStyle = styled.input<{ $bgColor?: string }>`
  position: relative;
  width: 100%;
  border: none;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.palette.background.input};
  font-size: 16px;
  background: ${({ $bgColor, theme }) =>
    $bgColor ?? theme.palette.background.separatorSecondary};
  border-radius: 8px;
  color: ${({ theme }) => theme.palette.text.muted};
  &:focus-visible {
    outline: none;
  }
`;

const InputWrapper = styled.div<{ $customImageSpacing?: boolean }>`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  gap: ${({ $customImageSpacing }) => (!$customImageSpacing ? '12px' : '0px')};
  padding-left: ${({ $customImageSpacing }) =>
    !$customImageSpacing ? '0px' : '24px'};
  align-items: center;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.background.separatorSecondary};
  border: 1px solid ${({ theme }) => theme.palette.background.separator};
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
        postfixIcon = undefined,
        onPostfixIconClick = undefined,
        $bgColor = undefined,
        onClick = undefined,
        pasteAllowed = true,
        copyAllowed = true,
        onKeyDown = undefined,
        leftImage,
        $customImageSpacing,
      }: InputProps,
      ref: ForwardedRef<HTMLInputElement>,
    ) => (
      <Flex direction="column" width="full" align="center" justify="center">
        {label && (
          <InputLabel>
            <LangDisplay text={label} />
          </InputLabel>
        )}
        <InputWrapper $customImageSpacing={$customImageSpacing}>
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
    ),
  );

Input.defaultProps = {
  label: undefined,
  placeholder: undefined,
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
  leftImage: undefined,
  $customImageSpacing: false,
};

Input.displayName = 'Input';
