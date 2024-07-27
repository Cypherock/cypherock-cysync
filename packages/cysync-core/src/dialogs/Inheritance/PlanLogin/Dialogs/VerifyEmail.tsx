import React from 'react';

import { OTPInputDialog } from '../../components';
import { useInheritancePlanLoginDialog } from '../context';

export const VerifyEmail: React.FC = () => {
  const {
    onClose,
    emails,
    onPrevious,
    otpLength,
    verifyEmail,
    isVerifyingEmail,
    isResendingOtp,
    onResendOtp,
    retriesRemaining,
    otpExpireTime,
    wrongOtpError,
  } = useInheritancePlanLoginDialog();

  return (
    <OTPInputDialog
      onClose={onClose}
      emails={emails}
      onBack={onPrevious}
      onResendOtp={onResendOtp}
      onVerify={verifyEmail}
      otpLength={otpLength}
      retriesRemaining={retriesRemaining}
      wrongOtpError={wrongOtpError}
      otpExpireTime={otpExpireTime}
      isVerifyingEmail={isVerifyingEmail}
      isResendingOtp={isResendingOtp}
    />
  );
};
