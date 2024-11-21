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
  showHeader?: boolean;
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
      showHeader = false,
    },
    ref,
  ) => {
    const lang = useAppSelector(selectLanguage);

    const strings = lang.strings.dialogs.inheritanceSyncPlans;

    const [otp, setOtp] = useState('');
    const { seconds: expireSeconds } = useCountdown(
      otpExpireTime ? new Date(otpExpireTime).getTime() : new Date().getTime(),
    );

    useEffect(() => {
      if (otp.length === otpLength) {
        onVerify(otp);
      }
    }, [otp]);

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

    const otpTitle = useMemo(() => {
      if (retriesRemaining <= 0) {
        return lang.strings.otp.noRetries.title;
      }

      if (wrongOtpError) {
        return lang.strings.otp.wrongOtpTitle;
      }

      return lang.strings.otp.title;
    }, [retriesRemaining, wrongOtpError]);

    const status = useMemo((): OTPInputStatus => {
      if (retriesRemaining <= 0) {
        return 'retryExceeded';
      }

      if (wrongOtpError) {
        return 'error';
      }

      return 'idle';
    }, [retriesRemaining, wrongOtpError]);

    const actionText = useMemo(() => {
      if (expireSeconds > 0) {
        return lang.strings.otp.buttons.resendWithTimeout;
      }
      return lang.strings.buttons.resendOTP;
    }, [expireSeconds]);

    return (
      <DialogBox width={800} onClose={onClose}>
        {onClose && showHeader && (
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
                onChange={setOtp}
                disabled={isVerifyingEmail || isResendingOtp}
                isActionDisbaled={expireSeconds > 0}
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
  showHeader: false,
};
