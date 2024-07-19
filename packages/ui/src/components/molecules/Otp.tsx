import React, { useState, ChangeEvent, KeyboardEvent, useRef } from 'react';
import styled from 'styled-components';

import Counter from './Counter';

import { Flex, Typography } from '../atoms';

type StateOfOtp = 'idle' | 'success' | 'error';

interface OTPProps {
  stateOfOtp: StateOfOtp;
  headerText: string;
  email: string;
  lowerContainerText: {
    infoText1: string;
    infoText2: string;
  };
  errorContainerText?: {
    errorHeading: string | null;
    errorText: string | null;
  };
}

const getBorderColor = (theme: any, stateOfOtp: StateOfOtp) => {
  const borderColorMap: Record<StateOfOtp, string> = {
    success: theme.palette.success.main,
    error: theme.palette.text.error,
    idle: theme.palette.border.primary,
  };

  return borderColorMap[stateOfOtp];
};

const OTPInput = styled.div<{ stateOfOtp: StateOfOtp }>`
  width: 56px;
  height: 72px;
  margin: 0 16px;
  text-align: center;
  font-size: 24px;
  border: 1px solid
    ${({ theme, stateOfOtp }) => getBorderColor(theme, stateOfOtp)};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;

  background-color: ${({ theme }) =>
    theme.palette.background.separatorSecondary};
  color: ${({ theme }) => theme.palette.text.white};

  &:focus-within {
    outline: none;
    border-color: ${({ theme, stateOfOtp }) =>
      getBorderColor(theme, stateOfOtp)};
  }
`;

const OtpText = styled.input`
  width: 14px;
  height: 36px;
  text-align: center;
  font-size: 24px;
  background: none;
  border: none;
  color: inherit;

  &:focus {
    outline: none;
  }
`;

const ResendLink = styled.button<{ stateOfOtp?: StateOfOtp }>`
  background: none;
  border: none;
  color: ${({ theme, stateOfOtp }) =>
    stateOfOtp === 'error'
      ? theme.palette.text.white
      : theme.palette.background.separator};
  cursor: pointer;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
`;

export const OTP: React.FC<OTPProps> = ({
  stateOfOtp,
  headerText,
  email,
  lowerContainerText,
  errorContainerText,
}) => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [triesLeft] = useState(4);
  const [resendDisabled, setResendDisabled] = useState(true);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    console.log('Resend OTP clicked');
  };

  const handleTimerEnd = () => {
    setResendDisabled(false);
  };

  return (
    <Flex
      $width="600px"
      direction="column"
      align="center"
      justify="center"
      $alignSelf="stretch"
    >
      <Typography
        $textAlign="center"
        $fontFamily="normal"
        $fontWeight="medium"
        $letterSpacing="1.2px"
        $fontSize={24}
        color={stateOfOtp === 'error' ? 'error' : 'white'}
      >
        {headerText}
      </Typography>
      <Flex mt="32px" mb="16px" justify="center">
        {otp.map((value, index) => (
          <OTPInput key={`otpinput-${index + 1}`} stateOfOtp={stateOfOtp}>
            <OtpText
              ref={el => {
                inputsRef.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={value}
              onChange={e => handleChange(e, index)}
              onKeyDown={e => handleKeyDown(e, index)}
            />
          </OTPInput>
        ))}
      </Flex>

      <Flex $width="83%" align="center" justify="space-between">
        <Flex gap={5} align="center">
          <Typography
            color={stateOfOtp === 'success' ? 'separator' : 'muted'}
            $fontFamily="normal"
            $fontSize={14}
            $fontWeight="normal"
          >
            {triesLeft} tries remaining
          </Typography>
          <Typography
            color={stateOfOtp === 'success' ? 'separator' : 'muted'}
            $fontFamily="normal"
            $fontSize={14}
            $fontWeight="normal"
          >
            <Counter initialTimer={25} onTimerEnd={handleTimerEnd} />
          </Typography>
        </Flex>

        <ResendLink
          disabled={resendDisabled}
          onClick={() => {
            setResendDisabled(true);
            handleResend();
          }}
          stateOfOtp={stateOfOtp}
        >
          Resend OTP
        </ResendLink>
      </Flex>

      <Flex direction="column" align="center" gap={4} mt="32px">
        <Typography
          $fontSize={12}
          $letterSpacing="0.6px"
          color={stateOfOtp === 'success' ? 'separator' : 'white'}
        >
          {lowerContainerText.infoText1}{' '}
          <Typography
            $fontWeight="bold"
            variant="span"
            color={stateOfOtp === 'success' ? 'separator' : 'white'}
            $letterSpacing="0.6px"
          >
            {email}
          </Typography>
        </Typography>
        <Typography
          $fontSize={12}
          $letterSpacing="0.6px"
          color={stateOfOtp === 'success' ? 'separator' : 'white'}
        >
          {lowerContainerText.infoText2}
        </Typography>
      </Flex>

      {stateOfOtp === 'error' && errorContainerText && (
        <Flex
          direction="column"
          gap={8}
          mt="32px"
          justify="center"
          align="center"
        >
          <Typography
            $fontFamily="normal"
            color="error"
            $fontWeight="medium"
            $fontSize={24}
            $letterSpacing="1.2px"
            $textAlign="center"
          >
            {errorContainerText.errorHeading}
          </Typography>
          <Typography
            $fontFamily="normal"
            color="white"
            $fontWeight="normal"
            $fontSize={16}
            $letterSpacing="0.8px"
          >
            {errorContainerText.errorText}
          </Typography>
        </Flex>
      )}
    </Flex>
  );
};

OTP.defaultProps = {
  errorContainerText: {
    errorHeading: null,
    errorText: null,
  },
};
