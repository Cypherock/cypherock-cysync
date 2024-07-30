import React from 'react';

import { OTPInputDialog } from '../../components';
import { useInheritanceSyncPlansDialog } from '../context';

export const VerifyEmail: React.FC = () => {
  const {
    onClose,
    email,
    onPrevious,
    otpLength,
    verifyEmail,
    isVerifyingEmail,
    isResendingOtp,
    onResendOtp,
    retriesRemaining,
    otpExpireTime,
    wrongOtpError,
  } = useInheritanceSyncPlansDialog();

  return (
    <OTPInputDialog
      onClose={onClose}
      emails={email}
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
