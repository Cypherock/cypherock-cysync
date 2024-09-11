import React, { useMemo, useRef } from 'react';

import {
  OTPInputDialog,
  OTPInputDialogRef,
} from '~/dialogs/Inheritance/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritancePinRecoveryDialog } from '../context';

export const VerifyOTP: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { title } = lang.strings.dialogs.inheritancePinRecovery.sync.verifyOtp;
  const { onClose, onPrevious, userDetails, onNext } =
    useInheritancePinRecoveryDialog();

  const email = userDetails?.email ?? '';
  const otpRef = useRef<OTPInputDialogRef | null>(null);

  const onVerify = () => {
    // DUMMY FUNCTION
    onNext();
    otpRef.current?.reset();
  };

  const onResend = () => {
    // DUMMY FUNCTION
  };

  const otpExpireTime = useMemo(
    () => new Date(Date.now() + 60 * 1000).toISOString(),
    [email],
  );
  const otpLength = 6;
  const retriesRemaining = 3;

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
      isVerifyingEmail={false}
      isResendingOtp={false}
      ref={otpRef}
    />
  );
};
