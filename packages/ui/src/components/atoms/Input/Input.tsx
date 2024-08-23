import React, { FC, ForwardedRef } from 'react';
import styled from 'styled-components';

import { InputLabel, InputLabelProps } from './InputLabel';

import { UtilsProps } from '../../utils';
import { Button } from '../Button';
import { Container } from '../Container';
import { Flex } from '../Flex';
import { LangDisplay } from '../LangDisplay';
import { Typography } from '../Typography';
import { QuestionMarkButton } from '../../molecules';

export interface InputProps {
  type: string;
  placeholder?: string;
  name: string;
  label?: string;
  rightLabel?: string;
  showRequiredStar?: boolean;
  onChange?: (val: string) => void;
  onBlur?: (val: string) => void;
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
  $customImageSpacing?: boolean;
  $noBorder?: boolean;
  required?: boolean;
  utilProps?: UtilsProps;
  autoFocus?: boolean;
  inputLabelProps?: InputLabelProps;
  tooltip?: string;
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
    disabled ? theme.palette.text.disabled : theme.palette.text[$textColor]};
  &:focus-visible {
    outline: none;
  }
  &::placeholder {
    line-height: 14px;
    color: ${({ disabled, theme }) =>
      disabled ? theme.palette.text.disabled : theme.palette.text.muted};
  }
  text-overflow: ellipsis;
`;

const InputWrapper = styled.div<{
  $customImageSpacing?: boolean;
  $isPostFixIcon?: boolean;
  $noBorder: boolean;
}>`
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: row;
  gap: ${({ $customImageSpacing }) => (!$customImageSpacing ? '12px' : '0px')};
  padding-left: ${({ $customImageSpacing }) =>
    !$customImageSpacing ? '0px' : '24px'};
  padding-right: ${({ $isPostFixIcon }) => (!$isPostFixIcon ? '0px' : '24px')};
  align-items: center;
  border-radius: 8px;
  background: ${({ theme }) => theme.palette.background.separatorSecondary};
  border: 1px solid
    ${({ theme, $noBorder }) =>
      $noBorder ? 'transparent' : theme.palette.background.separator};
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
        showRequiredStar = undefined,
        rightLabel = undefined,
        onChange = undefined,
        onBlur = undefined,
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
        required = false,
        leftImage,
        $customImageSpacing,
        $noBorder = false,
        utilProps,
        autoFocus = false,
        inputLabelProps,
        tooltip = undefined,
      }: InputProps,
      ref: ForwardedRef<HTMLInputElement>,
    ) => (
      <Flex
        direction="column"
        width="full"
        align="center"
        justify="center"
        {...(utilProps ?? {})}
      >
        {label && (
          <InputLabel p={0} {...(inputLabelProps ?? {})}>
            <Container $variant="span" align="center" justify="space-between">
              <Flex gap={4}>
                <LangDisplay text={label} />
                {tooltip && (
                  <QuestionMarkButton content={tooltip} position="right" />
                )}
              </Flex>
              <span>
                {rightLabel && <LangDisplay text={rightLabel} />}
                {showRequiredStar && (
                  <Typography variant="span" color="error">
                    {' '}
                    *
                  </Typography>
                )}
              </span>
            </Container>
          </InputLabel>
        )}
        <InputWrapper
          $noBorder={$noBorder}
          $customImageSpacing={$customImageSpacing}
          $isPostFixIcon={Boolean(postfixIcon)}
        >
          {leftImage}
          <InputStyle
            ref={ref}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            $bgColor={$bgColor}
            value={value}
            required={required}
            onClick={onClick}
            autoFocus={autoFocus}
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
            onBlur={e => onBlur?.(e.target.value)}
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
  rightLabel: undefined,
  showRequiredStar: undefined,
  placeholder: undefined,
  postfixText: undefined,
  onChange: undefined,
  onBlur: undefined,
  value: undefined,
  disabled: false,
  $noBorder: false,
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
  $customImageSpacing: false,
  required: false,
  utilProps: undefined,
  autoFocus: false,
  inputLabelProps: undefined,
  tooltip: undefined,
};

Input.displayName = 'Input';
