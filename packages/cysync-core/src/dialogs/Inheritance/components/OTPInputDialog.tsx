import {
  Button,
  CloseButton,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  DialogBoxHeader,
  Flex,
  LangDisplay,
  OTPInput,
  OTPInputStatus,
  ScrollableContainer,
  Typography,
} from '@cypherock/cysync-ui';
import { formatSecondsToMinutes } from '@cypherock/cysync-utils';
import React, {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import { useCountdown } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

export interface OTPInputDialogRef {
  reset: () => void;
}

export interface OTPInputDialogProps {
  onClose?: () => void;
  emails: string | string[];
  onBack: () => void;
  otpLength: number;
  onVerify: (otp: string) => void;
  isVerifyingEmail: boolean;
  isResendingOtp: boolean;
  onResendOtp: () => void;
  retriesRemaining: number;
  otpExpireTime?: string;
  wrongOtpError?: boolean;
  title?: string;
}

export const OTPInputDialog: React.FC<
  OTPInputDialogProps & { ref?: ForwardedRef<OTPInputDialogRef> }
> = forwardRef<OTPInputDialogRef, OTPInputDialogProps>(
  (
    {
      onClose,
      emails,
      onBack,
      otpLength,
      onVerify,
      isVerifyingEmail,
      isResendingOtp,
      onResendOtp,
      retriesRemaining,
      otpExpireTime,
      wrongOtpError,
      title,
    },
    ref,
  ) => {
    const lang = useAppSelector(selectLanguage);

    const strings = lang.strings.dialogs.inheritanceSyncPlans;

    const [otp, setOtp] = useState('');
    const { seconds: expireSeconds } = useCountdown(
      otpExpireTime ? new Date(otpExpireTime).getTime() : new Date().getTime(),
    );

    const onOtpChange = (val: string) => {
      setOtp(val);

      if (val.length === otpLength) {
        onVerify(val);
      }
    };

    const onResend = () => {
      onResendOtp();
    };

    const textVariables = useMemo(
      () => ({
        email: (Array.isArray(emails) ? emails.join(' & ') : emails).replace(
          /\*/g,
          `\\*`,
        ),
        retries: retriesRemaining.toString(),
        timeout: formatSecondsToMinutes(expireSeconds),
      }),
      [emails, retriesRemaining, expireSeconds],
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

    const getActionText = () => {
      if (expireSeconds > 0) {
        return lang.strings.buttons.resendOTP;
      }
      return lang.strings.otp.buttons.resendWithTimeout;
    };

    useEffect(() => {
      if (!isVerifyingEmail) {
        setOtp('');
      }
    }, [isVerifyingEmail]);

    useImperativeHandle<any, OTPInputDialogRef>(
      ref,
      () => ({
        reset: () => {
          setOtp('');
        },
      }),
      [],
    );

    const otpTitle = getTitle();
    const status = getStatus();
    const actionText = getActionText();

    return (
      <DialogBox width={800} onClose={onClose}>
        {onClose && (
          <DialogBoxHeader direction="row" justify="flex-end" py={2} px={3}>
            <CloseButton width={24} onClick={onClose} />
          </DialogBoxHeader>
        )}
        <ScrollableContainer>
          <DialogBoxBody px={5} py={4} gap={0}>
            <Flex
              direction="column"
              align="center"
              justify="center"
              $width="100%"
            >
              <Typography
                $fontSize={20}
                $textAlign="center"
                color="white"
                mb={4}
              >
                {title ?? strings.verifyEmail.title}
              </Typography>
              <OTPInput
                mx="auto"
                title={otpTitle}
                status={status}
                onAction={onResend}
                otpLength={otpLength}
                subText={lang.strings.otp.triesRemaining}
                actionText={actionText}
                textVariables={textVariables}
                infoText={lang.strings.otp.infoTexts}
                errorSubText={lang.strings.otp.noRetries.subTitle}
                value={otp}
                onChange={onOtpChange}
                disabled={isVerifyingEmail || isResendingOtp}
              />
            </Flex>
          </DialogBoxBody>
        </ScrollableContainer>
        <DialogBoxFooter py={4} px={5}>
          <Button
            variant="secondary"
            disabled={isVerifyingEmail || isResendingOtp}
            onClick={status === 'retryExceeded' ? onClose : onBack}
            type="button"
          >
            <LangDisplay
              text={
                status === 'retryExceeded'
                  ? lang.strings.buttons.exit
                  : lang.strings.buttons.back
              }
            />
          </Button>
        </DialogBoxFooter>
      </DialogBox>
    );
  },
);

OTPInputDialog.displayName = 'OTPInputDialog';

OTPInputDialog.defaultProps = {
  wrongOtpError: undefined,
  otpExpireTime: undefined,
  title: undefined,
  onClose: undefined,
};
