import React from 'react';
import OtpInput from 'react-otp-input';
import styled from 'styled-components';

import { Button, Container, Flex, LangDisplay, Typography } from '../atoms';
import { UtilsProps } from '../utils';

export type OTPInputStatus = 'idle' | 'success' | 'error' | 'retryExceeded';

export interface OTPInputProps extends UtilsProps {
  title: string;
  status: OTPInputStatus;
  otpLength: number;
  actionText?: string;
  isActionDisbaled?: boolean;
  disabled?: boolean;
  subText?: string;
  errorSubText?: string;
  infoText?: string[];
  textVariables?: Record<string, string>;
  value: string;
  onChange: (value: string) => void;
  onAction: () => void;
}

const getBorderColor = (theme: any, status: OTPInputStatus) => {
  const borderColorMap: Record<OTPInputStatus, string> = {
    success: theme.palette.success.main,
    error: theme.palette.text.error,
    idle: theme.palette.border.popup,
    retryExceeded: theme.palette.border.popup,
  };

  return borderColorMap[status];
};

const OTPSingleInputContainer = styled.input<{
  $status: OTPInputStatus;
}>`
  width: 56px !important;
  height: 72px;
  text-align: center;
  font-size: 24px;
  border: 1px solid ${({ theme, $status }) => getBorderColor(theme, $status)};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 0px;

  background-color: ${({ theme }) =>
    theme.palette.background.separatorSecondary};
  color: ${({ theme }) => theme.palette.text.white};

  &:focus-within {
    outline: none;
    border-color: ${({ theme, $status }) => getBorderColor(theme, $status)};
  }

  -moz-appearance: textfield;
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
`;

const ActionButton = styled(Button)`
  color: ${({ theme }) => theme.palette.text.white};
  font-weight: 400;

  &:disabled {
    color: ${({ theme }) => theme.palette.background.separator};
  }

  font-size: 14px;
`;

export const OTPInput: React.FC<OTPInputProps> = ({
  status,
  title,
  infoText,
  textVariables,
  errorSubText,
  otpLength,
  value,
  onChange,
  subText,
  isActionDisbaled,
  actionText,
  disabled,
  onAction,
  ...rest
}) => {
  const isRetryExceeded = status === 'retryExceeded';

  return (
    <Flex
      $width="600px"
      direction="column"
      align="center"
      justify="center"
      $alignSelf="stretch"
      {...rest}
    >
      <Typography
        $textAlign="center"
        $fontFamily="normal"
        $fontWeight="medium"
        $letterSpacing="1.2px"
        $fontSize={24}
        color={['error', 'retryExceeded'].includes(status) ? 'error' : 'white'}
      >
        {title}
      </Typography>

      {!isRetryExceeded && (
        <>
          <Flex mt={4} mb={2} justify="center">
            <OtpInput
              value={value}
              onChange={onChange}
              numInputs={otpLength}
              shouldAutoFocus
              renderSeparator={<Container $width={16} />}
              renderInput={props => (
                <OTPSingleInputContainer
                  {...props}
                  disabled={disabled}
                  $status={status}
                  type="number"
                />
              )}
            />
          </Flex>

          <Flex $width="100%" px="92px" align="center" justify="space-between">
            <Flex gap={5} align="center">
              {subText && (
                <Typography
                  color={disabled ? 'separator' : 'muted'}
                  $fontFamily="normal"
                  $fontSize={14}
                  $fontWeight="normal"
                >
                  <LangDisplay text={subText} variables={textVariables} />
                </Typography>
              )}
            </Flex>

            {actionText && (
              <ActionButton
                /* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */
                disabled={disabled || isActionDisbaled}
                onClick={onAction}
                variant="text"
              >
                <LangDisplay text={actionText} variables={textVariables} />
              </ActionButton>
            )}
          </Flex>

          {infoText && infoText.length > 0 && (
            <Flex direction="column" align="center" gap={4} mt="32px">
              {infoText.map(text => (
                <Typography
                  $fontSize={12}
                  $letterSpacing="0.6px"
                  color={disabled ? 'separator' : 'white'}
                  key={text}
                >
                  <LangDisplay
                    text={text}
                    variables={textVariables}
                    $allowMarkdown
                  />
                </Typography>
              ))}
            </Flex>
          )}
        </>
      )}

      {isRetryExceeded && errorSubText && (
        <Flex direction="column" align="center" gap={4} mt={1}>
          <Typography $fontSize={16} $letterSpacing="0.8px" color="white">
            <LangDisplay
              text={errorSubText}
              variables={textVariables}
              $allowMarkdown
            />
          </Typography>
        </Flex>
      )}
    </Flex>
  );
};

OTPInput.defaultProps = {
  disabled: undefined,
  isActionDisbaled: undefined,
  textVariables: undefined,
  subText: undefined,
  infoText: undefined,
  errorSubText: undefined,
  actionText: undefined,
};
