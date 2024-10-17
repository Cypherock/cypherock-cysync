import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  OTPInputDialog,
  OTPInputDialogRef,
} from '~/dialogs/Inheritance/components';
import { OtpVerificationConcern } from '~/dialogs/Inheritance/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceGoldPlanPurchaseDialog } from '../../context';
import { tabIndicies } from '../../context/useDialogHandler';

export const VerifyNomineeOtp: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritance.dialog.verifyOTP;

  const {
    onPrevious,
    onNext,
    nomineeOtpSubmit,
    nomineeOtpVerificationDetails,
    isSubmittingNomineeDetails,
    isOnSummaryPage,
    goTo,
  } = useInheritanceGoldPlanPurchaseDialog();

  const title = useMemo(() => {
    const map: Record<OtpVerificationConcern, string> = {
      [OtpVerificationConcern.primary]: strings.primaryEmailOTP.title,
      [OtpVerificationConcern.alternate]: strings.alternateEmailOTP.title,
      [OtpVerificationConcern.login]: lang.strings.otp.title,
    };

    if (!nomineeOtpVerificationDetails) return '';

    return map[nomineeOtpVerificationDetails.concern];
  }, [nomineeOtpVerificationDetails?.concern, lang]);

  const otpRef = useRef<OTPInputDialogRef | null>(null);

  const onVerify = useCallback(
    async (otp: string) => {
      await nomineeOtpSubmit(otp);
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
  const email = nomineeOtpVerificationDetails?.emails ?? '';

  useEffect(() => {
    if (otpRef.current) {
      otpRef.current.reset();
    }
  }, [nomineeOtpVerificationDetails?.id]);

  useEffect(() => {
    if (!nomineeOtpVerificationDetails) {
      if (isOnSummaryPage) goTo(tabIndicies.summary.tabNumber);
      else onNext();
    }
  }, [nomineeOtpVerificationDetails]);

  if (!nomineeOtpVerificationDetails) {
    return null;
  }

  return (
    <OTPInputDialog
      title={title}
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
