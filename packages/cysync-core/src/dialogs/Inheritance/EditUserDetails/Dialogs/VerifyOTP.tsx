import { sleep } from '@cypherock/sdk-utils';
import React, { useMemo, useRef, useState } from 'react';

import { LoaderDialog } from '~/components';
import {
  OTPInputDialog,
  OTPInputDialogRef,
} from '~/dialogs/Inheritance/components';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceEditUserDetailsDialog } from '../context';

export const VerifyOTP: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const strings = lang.strings.inheritance.dialog.verifyOTP;

  const { onClose, onPrevious, userDetails, onNext } =
    useInheritanceEditUserDetailsDialog();

  const [email, setEmail] = useState(userDetails?.email ?? '');
  const [title, setTitle] = useState(strings.primaryEmailOTP.title);
  const [loading, setLoading] = useState(false);

  const otpRef = useRef<OTPInputDialogRef | null>(null);

  const onVerify = async () => {
    // DUMMY FUNCTION
    if (email === userDetails?.alternateEmail) {
      setLoading(true);
      await sleep(2000);
      onNext();
      return;
    }

    setEmail(userDetails?.alternateEmail ?? '');
    setTitle(strings.alternateEmailOTP.title);
    otpRef.current?.reset();
  };

  const otpExpireTime = useMemo(
    () => new Date(Date.now() + 60 * 1000).toISOString(),
    [email],
  );
  const otpLength = 6;
  const retriesRemaining = 3;

  if (loading) {
    return (
      <LoaderDialog
        title={
          lang.strings.dialogs.inheritanceEditUserDetails.verifyOtp.loading
            .title
        }
        subtext={
          lang.strings.dialogs.inheritanceEditUserDetails.verifyOtp.loading
            .subtext
        }
      />
    );
  }

  return (
    <OTPInputDialog
      title={title}
      onClose={onClose}
      emails={email}
      onBack={onPrevious}
      onResendOtp={onPrevious}
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
