import React, { useMemo, useRef } from 'react';

import {
  OTPInputDialog,
  OTPInputDialogRef,
} from '~/dialogs/Inheritance/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEstateRecoveryDialog } from '../context';

export const VerifyOTP: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings =
    lang.strings.dialogs.inheritanceEstateRecovery.walletAuth.verification;

  const { onClose, onPrevious, onNext, userDetails } =
    useInheritanceEstateRecoveryDialog();

  const email = userDetails?.email ?? '';
  const alternateEmail = userDetails?.alternateEmail ?? '';

  const otpRef = useRef<OTPInputDialogRef | null>(null);

  const onVerify = () => {
    // DUMMY FUNCTION

    onNext();
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
      title={strings.title}
      onClose={onClose}
      emails={[email, alternateEmail]}
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
