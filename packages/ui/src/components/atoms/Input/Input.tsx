import React, { FC, ForwardedRef } from 'react';
import styled from 'styled-components';

import { InputLabel } from './InputLabel';

import { Button } from '../Button';
import { Flex } from '../Flex';
import { LangDisplay } from '../LangDisplay';
import { SpacingProps } from '../../utils';
import { Typography, TypographyColor, TypographyProps } from '../Typography';

export interface InputProps extends SpacingProps {
  type: string;
  placeholder?: string;
  name: string;
  label?: string;
  onChange?: (val: string) => void;
  value?: string;
  disabled?: boolean;
  error?: boolean;
  postfixIcon?: React.ReactNode | string;
  postfixTextVariant?: TypographyProps['variant'];
  postfixTextColor?: TypographyColor;
  onPostfixIconClick?: () => void;
  $bgColor?: string;
  onClick?: () => void;
  pasteAllowed?: boolean;
  copyAllowed?: boolean;
}

const InputStyle = styled.input<{ $bgColor?: string; error?: boolean }>`
  position: relative;
  width: 100%;
  border: none;
  padding: 12px 24px;
  background-color: ${({ theme }) => theme.palette.background.input};
  font-size: 16px;
  background: ${({ $bgColor, theme }) =>
    $bgColor ?? theme.palette.background.separatorSecondary};
  border: 1px solid
    ${({ theme, error }) =>
      error ? theme.palette.warn.main : theme.palette.background.separator};
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
  right: 24px;
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
        error = false,
        postfixIcon = undefined,
        postfixTextVariant = 'fineprint',
        postfixTextColor = 'muted',
        onPostfixIconClick = undefined,
        $bgColor = undefined,
        onClick = undefined,
        pasteAllowed = true,
        copyAllowed = true,
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
          <InputStyle
            ref={ref}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            $bgColor={$bgColor}
            error={error}
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
            onChange={e => onChange && onChange(e.target.value)}
          />

          {postfixIcon && (
            <PostfixIconStyle>
              {typeof postfixIcon === 'string' ? (
                <Typography
                  display="flex"
                  variant={postfixTextVariant}
                  color={postfixTextColor}
                  $fontSize={13}
                >
                  {postfixIcon}
                </Typography>
              ) : (
                <Button
                  type="button"
                  variant="none"
                  display="flex"
                  onClick={onPostfixIconClick}
                >
                  {postfixIcon}
                </Button>
              )}
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
  error: false,
  postfixIcon: undefined,
  postfixTextColor: undefined,
  postfixTextVariant: undefined,
  onPostfixIconClick: undefined,
  $bgColor: undefined,
  onClick: undefined,
  pasteAllowed: true,
  copyAllowed: true,
};

Input.displayName = 'Input';
