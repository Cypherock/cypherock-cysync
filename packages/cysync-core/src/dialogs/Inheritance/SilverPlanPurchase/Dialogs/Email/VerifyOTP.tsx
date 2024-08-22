import React, { useMemo, useRef, useState } from 'react';

import {
  OTPInputDialog,
  OTPInputDialogRef,
} from '~/dialogs/Inheritance/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceSilverPlanPurchaseDialog } from '../../context';

export const VerifyOTP: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritanceSilverPlanPurchase.email;

  const { onClose, onPrevious, userDetails, onNext } =
    useInheritanceSilverPlanPurchaseDialog();

  const [email, setEmail] = useState(userDetails?.email ?? '');
  const [title, setTitle] = useState(strings.primaryEmailOTP.title);

  const otpRef = useRef<OTPInputDialogRef | null>(null);

  const onVerify = () => {
    // DUMMY FUNCTION
    if (email === userDetails?.alternateEmail) {
      onNext();
      return;
    }

    setEmail(userDetails?.alternateEmail ?? '');
    setTitle(strings.alternateEmailOTP.title);
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