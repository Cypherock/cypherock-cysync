import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { OTPInputDialog, OTPInputDialogRef } from '../../components';
import { useInheritancePlanLoginDialog } from '../context';

export const VerifyEmail: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.dialogs.inheritancePlanLogin;

  const {
    onClose,
    onPrevious,
    onNext,
    otpVerificationDetails,
    verifyOtp,
    isVerifyingOtp,
  } = useInheritancePlanLoginDialog();

  const { title } = strings.verifyEmail;

  const otpRef = useRef<OTPInputDialogRef | null>(null);

  const onVerify = useCallback(
    async (otp: string) => {
      await verifyOtp(otp);
    },
    [verifyOtp],
  );

  const otpExpireTime = useMemo(
    () => otpVerificationDetails?.otpExpiry ?? '',
    [otpVerificationDetails?.otpExpiry],
  );

  const otpLength = 6;

  const retriesRemaining = otpVerificationDetails?.retriesRemaining ?? 3;
  const email = otpVerificationDetails?.emails ?? '';

  useEffect(() => {
    if (otpRef.current) {
      otpRef.current.reset();
    }
  }, [otpVerificationDetails?.id]);

  useEffect(() => {
    if (!otpVerificationDetails) onNext();
  }, [otpVerificationDetails]);

  if (!otpVerificationDetails) {
    return null;
  }

  return (
    <OTPInputDialog
      title={title}
      onClose={onClose}
      showHeader
      emails={email}
      onBack={onPrevious}
      onResendOtp={onPrevious}
      onVerify={onVerify}
      otpLength={otpLength}
      retriesRemaining={retriesRemaining}
      otpExpireTime={otpExpireTime}
      isVerifyingEmail={isVerifyingOtp}
      isResendingOtp={false}
      wrongOtpError={otpVerificationDetails.showIncorrectError}
      ref={otpRef}
    />
  );
};
