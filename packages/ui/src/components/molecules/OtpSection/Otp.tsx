import React, { useState, useEffect, ChangeEvent } from 'react';
import styled from 'styled-components';

interface OTPProps {
  status: 'idle' | 'success' | 'error';
  heading: string;
  email: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  width: 600px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.palette.border.primary};
`;

const Heading = styled.h2<{ status: 'idle' | 'success' | 'error' }>`
  color: ${({ theme, status }) =>
    status === 'error' ? theme.palette.text.error : theme.palette.text.white};
  text-align: center;
  font-family: Poppins;
  font-size: 24px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.2px;
`;

const OTPBoxContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 32px;
  margin-bottom: 16px;
`;

const OTPInput = styled.input<{ status: 'idle' | 'success' | 'error' }>`
  width: 56px;
  height: 72px;
  margin: 0 16px;
  text-align: center;
  font-size: 24px;
  border: 1px solid
    ${({ theme, status }) =>
      // eslint-disable-next-line no-nested-ternary
      status === 'success'
        ? theme.palette.success.main
        : status === 'error'
        ? theme.palette.background.danger
        : theme.palette.border.primary};
  border-radius: 8px;
  padding: 12px;
  background-color: ${({ theme }) =>
    theme.palette.background.separatorSecondary};
  color: ${({ theme }) => theme.palette.text.white};

  &:focus {
    outline: none;
    border-color: ${({ theme, status }) =>
      // eslint-disable-next-line no-nested-ternary
      status === 'success'
        ? theme.palette.border.success
        : status === 'error'
        ? '#FF0000'
        : theme.palette.primary.main};
  }
`;

const InfoText = styled.p<{ status?: 'idle' | 'success' | 'error' }>`
  color: ${({ theme, status }) =>
    status === 'success'
      ? theme.palette.background.separator
      : theme.palette.text.white};
  font-size: 12px;
  letter-spacing: 0.6px;
`;

const HighlightText = styled.span`
  font-weight: 700;
`;
const TriesText = styled.p<{ status?: 'idle' | 'success' | 'error' }>`
  color: ${({ theme, status }) =>
    status === 'success'
      ? theme.palette.background.separator
      : theme.palette.text.muted};
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
`;

const ResendLink = styled.button<{ status?: 'idle' | 'success' | 'error' }>`
  background: none;
  border: none;
  color: ${({ theme, status }) =>
    status === 'error'
      ? theme.palette.text.white
      : theme.palette.background.separator};
  cursor: pointer;
  font-family: Poppins;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
`;
const TimerTriesContainer = styled.div<{
  status?: 'idle' | 'success' | 'error';
}>`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const LowerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-top: 32px;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 32px;
`;

const ErrorText = styled.p`
  font-size: 16px;
  letter-spacing: 0.8px;
  color: ${({ theme }) => theme.palette.text.white};
  font-family: Poppins;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
const OTP: React.FC<OTPProps> = ({ status, heading, email }) => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [triesLeft] = useState(4);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(25);

  useEffect(() => {
    if (timer > 0) {
      const timeout = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timeout);
    }
    setResendDisabled(false);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => {};
  }, [timer]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextSibling = document.getElementById(`otp-input-${index + 1}`);
        if (nextSibling) {
          nextSibling.focus();
        }
      }
    }
  };

  return (
    <Container>
      <Heading status={status}>{heading}</Heading>
      <OTPBoxContainer>
        {otp.map((value, index) => (
          <OTPInput
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            id={`otp-input-${index}`}
            type="text"
            maxLength={1}
            value={value}
            onChange={e => handleChange(e, index)}
            status={status}
          />
        ))}
      </OTPBoxContainer>

      <FlexContainer>
        <TimerTriesContainer>
          <TriesText status={status}>{triesLeft} tries remaining</TriesText>
          <TriesText status={status}>{timer}..</TriesText>
        </TimerTriesContainer>

        <ResendLink
          disabled={resendDisabled}
          onClick={() => setTimer(25)}
          status={status}
        >
          Resend OTP
        </ResendLink>
      </FlexContainer>

      <LowerContainer>
        <InfoText status={status}>
          An email has been sent to <HighlightText>{email}</HighlightText>
        </InfoText>
        <InfoText status={status}>
          Please ask the nominee to share the code received within the email
        </InfoText>
      </LowerContainer>
      {status === 'error' && (
        <ErrorContainer>
          <Heading status="error">You have 0 retries remaining</Heading>
          <ErrorText>Please exit the flow and restart</ErrorText>
        </ErrorContainer>
      )}
    </Container>
  );
};

export default OTP;
