import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  OTPInputDialog,
  OTPInputDialogRef,
} from '~/dialogs/Inheritance/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';

export const VerifyNomineeOtp: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritance.dialog.verifyOTP;

  const {
    onClose,
    onPrevious,
    onNext,
    nomineeOtpSubmit,
    nomineeOtpVerificationDetails,
    isSubmittingNomineeDetails,
  } = useInheritanceGoldPlanPurchaseDialog();

  const { title } = strings.primaryEmailOTP;
  const otpRef = useRef<OTPInputDialogRef | null>(null);

  const onVerify = useCallback(
    async (otp: string) => {
      const result = await nomineeOtpSubmit(otp);
      if (result) onNext();
    },
    [nomineeOtpSubmit],
  );

  const onResend = () => {
    // DUMMY FUNCTION
  };

  const otpExpireTime = useMemo(
    () => nomineeOtpVerificationDetails?.otpExpiry ?? '',
    [nomineeOtpVerificationDetails?.otpExpiry],
  );

  const otpLength = 6;

  const retriesRemaining = nomineeOtpVerificationDetails?.retriesRemaining ?? 3;
  const email = nomineeOtpVerificationDetails?.email ?? '';

  useEffect(() => {
    if (otpRef.current) {
      otpRef.current.reset();
    }
  }, [nomineeOtpVerificationDetails?.id]);

  useEffect(() => {
    if (!nomineeOtpVerificationDetails) onNext();
  }, [nomineeOtpVerificationDetails]);

  if (!nomineeOtpVerificationDetails) {
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
      isVerifyingEmail={isSubmittingNomineeDetails}
      isResendingOtp={false}
      wrongOtpError={nomineeOtpVerificationDetails.showIncorrectError}
      ref={otpRef}
    />
  );
};
