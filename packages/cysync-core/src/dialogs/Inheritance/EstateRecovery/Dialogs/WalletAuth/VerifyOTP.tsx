import React, { useMemo, useRef, useCallback, useEffect } from 'react';

import {
  OTPInputDialog,
  OTPInputDialogRef,
} from '~/dialogs/Inheritance/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEstateRecoveryDialog } from '../../context';

export const VerifyOTP: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { title } =
    lang.strings.dialogs.inheritanceEstateRecovery.wallet.verification;
  const {
    onPrevious,
    onNext,
    otpVerificationDetails,
    verifyOtp,
    isVerifyingOtp,
  } = useInheritanceEstateRecoveryDialog();

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
