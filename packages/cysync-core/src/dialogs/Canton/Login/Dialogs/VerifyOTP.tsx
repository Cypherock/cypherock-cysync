import React, { useMemo, useRef } from 'react';

import {
  OTPInputDialog,
  OTPInputDialogRef,
} from '~/dialogs/Inheritance/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useCantonLoginDialog } from '../context';

export const VerifyOTP: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.addAccount.cantonSignup.verifyOTP;

  const {
    onPrevious,
    onClose,
    onOTPSubmit,
    otpVerificationDetails,
    isSubmittingOTP,
  } = useCantonLoginDialog();

  const otpRef = useRef<OTPInputDialogRef | null>(null);

  const otpExpireTime = useMemo(
    () => otpVerificationDetails?.otpExpiry ?? '',
    [otpVerificationDetails?.otpExpiry],
  );

  const otpLength = 6;

  const retriesRemaining = otpVerificationDetails?.retriesRemaining ?? 3;
  const email = otpVerificationDetails?.email ?? '';

  if (!otpVerificationDetails) {
    return null;
  }

  return (
    <OTPInputDialog
      onClose={onClose}
      title={strings.title}
      emails={email}
      onBack={onPrevious}
      onResendOtp={onPrevious}
      onVerify={onOTPSubmit}
      otpLength={otpLength}
      retriesRemaining={retriesRemaining}
      otpExpireTime={otpExpireTime}
      isVerifyingEmail={isSubmittingOTP}
      isResendingOtp={false}
      wrongOtpError={otpVerificationDetails.showIncorrectError}
      ref={otpRef}
    />
  );
};
