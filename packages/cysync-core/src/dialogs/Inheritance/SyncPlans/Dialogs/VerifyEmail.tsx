import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { OTPInputDialog, OTPInputDialogRef } from '../../components';
import { useInheritanceSyncPlansDialog } from '../context';

export const VerifyEmail: React.FC = () => {
  const {
    onClose,
    email,
    onPrevious,
    verifyEmail,
    isVerifyingEmail,
    otpVerificationDetails,
  } = useInheritanceSyncPlansDialog();

  const otpRef = useRef<OTPInputDialogRef | null>(null);

  const onVerify = useCallback(
    (otp: string) => {
      verifyEmail(otp);
    },
    [verifyEmail],
  );

  const otpExpireTime = useMemo(
    () => otpVerificationDetails?.otpExpiry ?? '',
    [otpVerificationDetails?.otpExpiry],
  );

  const otpLength = 6;

  const retriesRemaining = otpVerificationDetails?.retriesRemaining ?? 3;

  useEffect(() => {
    if (otpRef.current) {
      otpRef.current.reset();
    }
  }, [otpVerificationDetails?.id]);

  useEffect(() => {
    if (!otpVerificationDetails) onClose();
  }, [otpVerificationDetails]);

  if (!otpVerificationDetails) {
    return null;
  }

  return (
    <OTPInputDialog
      onClose={onClose}
      showHeader
      emails={email}
      onBack={onPrevious}
      onResendOtp={onPrevious}
      onVerify={onVerify}
      otpLength={otpLength}
      retriesRemaining={retriesRemaining}
      wrongOtpError={otpVerificationDetails.showIncorrectError}
      otpExpireTime={otpExpireTime}
      isVerifyingEmail={isVerifyingEmail}
      isResendingOtp={false}
    />
  );
};
