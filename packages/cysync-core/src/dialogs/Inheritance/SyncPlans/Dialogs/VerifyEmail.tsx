import {
  Flex,
  OTPInput,
  OTPInputStatus,
  Typography,
} from '@cypherock/cysync-ui';
import React, { useEffect, useMemo, useState } from 'react';

import { useCountdown } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { useInheritanceSyncPlansDialog } from '../context';
import { InheritanceSyncPlansLayout } from '../Layout';

export const VerifyEmail: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const {
    onClose,
    email,
    onPrevious,
    otpLength,
    verifyEmail,
    isVerifyingEmail,
    isResendingOtp,
    onResendOtp,
    retriesRemaining,
    otpExpireTime,
    wrongOtpError,
  } = useInheritanceSyncPlansDialog();

  const strings = lang.strings.dialogs.inheritanceSyncPlans;

  const [otp, setOtp] = useState('');
  const { seconds: expireSeconds } = useCountdown(
    otpExpireTime ? new Date(otpExpireTime).getTime() : new Date().getTime(),
  );

  const onOtpChange = (val: string) => {
    setOtp(val);

    if (val.length === otpLength) {
      verifyEmail(otp);
    }
  };

  const onResend = () => {
    onResendOtp();
  };

  const textVariables = useMemo(
    () => ({
      email,
      retries: retriesRemaining.toString(),
      timeout: expireSeconds.toString(),
    }),
    [email, retriesRemaining, expireSeconds],
  );

  const getStatus = (): OTPInputStatus => {
    if (retriesRemaining <= 0) {
      return 'retryExceeded';
    }

    if (wrongOtpError) {
      return 'error';
    }

    return 'idle';
  };

  const getTitle = () => {
    if (retriesRemaining <= 0) {
      return lang.strings.otp.noRetries.title;
    }

    if (wrongOtpError) {
      return lang.strings.otp.wrongOtpTitle;
    }

    return lang.strings.otp.title;
  };

  useEffect(() => {
    if (!isVerifyingEmail) {
      setOtp('');
    }
  }, [isVerifyingEmail]);

  return (
    <InheritanceSyncPlansLayout
      onClose={onClose}
      actionButtonText={lang.strings.buttons.back}
      isActionButtonDisabled={isVerifyingEmail || isResendingOtp}
      onActionButtonClick={onPrevious}
      actionButtonVariant="secondary"
    >
      <Flex direction="column" align="center" justify="center" $width="100%">
        <Typography $fontSize={20} $textAlign="center" color="white" mb={4}>
          {strings.verifyEmail.title}
        </Typography>
        <OTPInput
          mx="auto"
          title={getTitle()}
          status={getStatus()}
          onAction={onResend}
          otpLength={otpLength}
          subText={lang.strings.otp.triesRemaining}
          actionText={lang.strings.buttons.resendOTP}
          textVariables={textVariables}
          infoText={lang.strings.otp.infoTexts}
          errorSubText={lang.strings.otp.noRetries.subTitle}
          value={otp}
          onChange={onOtpChange}
          disabled={isVerifyingEmail || isResendingOtp}
        />
      </Flex>
    </InheritanceSyncPlansLayout>
  );
};
