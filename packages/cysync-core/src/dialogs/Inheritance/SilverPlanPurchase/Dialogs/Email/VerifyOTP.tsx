import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  OTPInputDialog,
  OTPInputDialogRef,
} from '~/dialogs/Inheritance/components';
import { OtpVerificationConcern } from '~/dialogs/Inheritance/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceSilverPlanPurchaseDialog } from '../../context';

export const VerifyOTP: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritance.dialog.verifyOTP;

  const {
    onPrevious,
    onNext,
    otpVerificationDetails,
    verifyOtp,
    isVerifyingOtp,
    onClose,
  } = useInheritanceSilverPlanPurchaseDialog();

  const title = useMemo(() => {
    const map: Record<OtpVerificationConcern, string> = {
      [OtpVerificationConcern.primary]: strings.primaryEmailOTP.title,
      [OtpVerificationConcern.alternate]: strings.alternateEmailOTP.title,
      [OtpVerificationConcern.login]:
        lang.strings.dialogs.inheritancePlanLogin.verifyEmail.title,
    };

    if (!otpVerificationDetails) return '';

    return map[otpVerificationDetails.concern];
  }, [otpVerificationDetails?.concern, lang]);

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
      onClose={onClose}
      title={title}
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
