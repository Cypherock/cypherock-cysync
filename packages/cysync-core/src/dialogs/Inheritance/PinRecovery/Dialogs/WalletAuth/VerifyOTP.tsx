import React, { useMemo, useRef, useCallback, useEffect } from 'react';

import {
  OTPInputDialog,
  OTPInputDialogRef,
} from '~/dialogs/Inheritance/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritancePinRecoveryDialog } from '../../context';

export const VerifyOTP: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { title } = lang.strings.dialogs.inheritancePinRecovery.sync.verifyOtp;
  const {
    onClose,
    onPrevious,
    onNext,
    otpVerificationDetails,
    verifyOtp,
    isVerifyingOtp,
  } = useInheritancePinRecoveryDialog();

  const otpRef = useRef<OTPInputDialogRef | null>(null);

  const onVerify = useCallback(
    async (otp: string) => {
      await verifyOtp(otp);
    },
    [verifyOtp],
  );

  const onResend = () => {
    // DUMMY FUNCTION
  };

  const otpExpireTime = useMemo(
    () => otpVerificationDetails?.otpExpiry ?? '',
    [otpVerificationDetails?.otpExpiry],
  );

  const otpLength = 6;

  const retriesRemaining = otpVerificationDetails?.retriesRemaining ?? 3;
  const email = otpVerificationDetails?.email ?? '';

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
      emails={email}
      onBack={onPrevious}
      onResendOtp={onResend}
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