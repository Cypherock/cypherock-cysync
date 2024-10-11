import { ServerErrorType } from '@cypherock/cysync-core-constants';
import { insertInheritancePlan } from '@cypherock/cysync-core-services';
import {
  IInheritancePlan,
  InheritancePlanType,
  InheritancePlanTypeMap,
} from '@cypherock/db-interfaces';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

import {
  ITabs,
  useAsync,
  useMemoReturn,
  useStateWithRef,
  useTabsAndDialogs,
} from '~/hooks';
import {
  inheritancePlanService,
  inheritanceSyncPlansService,
  InheritanceSyncPlansInitResponse,
  InheritanceUserTypeMap,
} from '~/services';
import { closeDialog, useAppDispatch } from '~/store';
import { getDB } from '~/utils';
import logger from '~/utils/logger';

import { EnterEmail, VerifyEmail } from '../Dialogs';

export interface IOtpVerificationDetails {
  id: string;
  email: string;
  retriesRemaining: number;
  otpExpiry: string;
  showIncorrectError?: boolean;
}

export interface InheritanceSyncPlansDialogContextInterface {
  tabs: ITabs;
  onNext: (tab?: number, dialog?: number) => void;
  goTo: (tab: number, dialog?: number) => void;
  onPrevious: () => void;
  currentTab: number;
  currentDialog: number;
  isDeviceRequired: boolean;
  onClose: () => void;
  email: string;
  onEnterEmail: (email: string) => void;
  isSendingEmail: boolean;
  startResponse?: InheritanceSyncPlansInitResponse;
  unhandledError?: any;
  onRetry: () => void;
  verifyEmail: (otp: string) => void;
  isVerifyingEmail: boolean;
  otpVerificationDetails?: IOtpVerificationDetails;
}

export const InheritanceSyncPlansDialogContext: Context<InheritanceSyncPlansDialogContextInterface> =
  createContext<InheritanceSyncPlansDialogContextInterface>(
    {} as InheritanceSyncPlansDialogContextInterface,
  );

export interface InheritanceSyncPlansDialogContextProviderProps {
  children: ReactNode;
}

export const InheritanceSyncPlansDialogProvider: FC<
  InheritanceSyncPlansDialogContextProviderProps
> = ({ children }) => {
  const dispatch = useAppDispatch();

  const deviceRequiredDialogsMap: Record<number, number[] | undefined> = {};
  const tabs: ITabs = [
    {
      name: 'Enter Email',
      dialogs: [<EnterEmail key="EnterEmail" />],
    },
    {
      name: 'Verify Email',
      dialogs: [<VerifyEmail key="Verify Email" />],
    },
  ];

  const {
    onNext,
    onPrevious,
    goTo,
    currentTab,
    currentDialog,
    isDeviceRequired,
  } = useTabsAndDialogs({
    deviceRequiredDialogsMap,
    tabs,
    dialogName: 'inheritanceSyncPlans',
  });

  const onClose = () => {
    dispatch(closeDialog('inheritanceSyncPlans'));
  };

  const [email, setEmail] = useState('');
  const [startResponse, setStartResponse] = useState<
    InheritanceSyncPlansInitResponse | undefined
  >(undefined);
  const [unhandledError, setUnhandledError] = useState<any>();
  const [
    otpVerificationDetails,
    setOtpVerificationDetails,
    otpVerificationDetailsRef,
  ] = useStateWithRef<IOtpVerificationDetails | undefined>(undefined);

  const onError = useCallback((e?: any) => {
    setUnhandledError(e);
  }, []);

  const sendEmailHanlder = useCallback(async (emailId: string) => {
    setEmail(emailId);
    const response = await inheritancePlanService.sync.init({ email: emailId });

    if (response.error) {
      throw response.error;
    }

    const otpDetails = response.result.otpDetails?.[0];

    if (otpDetails) {
      setOtpVerificationDetails({
        id: 'emailVerification',
        email: emailId,
        ...otpDetails,
      });
    }

    setStartResponse(response.result);
    goTo(1);

    return true;
  }, []);

  const [sendEmail, isSendingEmail, , resetSendEmail] = useAsync(
    sendEmailHanlder,
    onError,
  );

  const onRetry = useCallback(() => {
    resetSendEmail();
    setUnhandledError(undefined);
    setStartResponse(undefined);
    goTo(0);
  }, []);

  const verifyEmailHandler = useCallback(
    async (otp: string) => {
      if (!startResponse || !otpVerificationDetailsRef.current) {
        return false;
      }

      const response = await inheritanceSyncPlansService.verify({
        requestId: startResponse.requestId,
        otp,
      });

      if (response.error) {
        if (response.error.code === ServerErrorType.OTP_VERIFICATION_FAILED) {
          setOtpVerificationDetails({
            ...otpVerificationDetailsRef.current,
            showIncorrectError: true,
            otpExpiry:
              response.error.details?.responseBody.otpExpiry ??
              otpVerificationDetailsRef.current.otpExpiry,
            retriesRemaining:
              response.error.details?.responseBody.retriesRemaining ??
              otpVerificationDetailsRef.current.retriesRemaining,
          });
          return false;
        }

        throw response.error;
      }

      const db = getDB();

      if (response.result.wallets) {
        for (const wallet of response.result.wallets) {
          const isNominee = wallet.role === InheritanceUserTypeMap.nominee;
          const isOwner = wallet.role === InheritanceUserTypeMap.owner;

          if (!isNominee && !isOwner) {
            logger.warn(
              `SyncPlans: Wallet ${wallet._id} is not a nominee or owner`,
            );
            continue;
          }

          if (isNominee && isOwner) {
            logger.warn(
              `SyncPlans: Wallet ${wallet._id} is both a nominee and owner`,
            );
            continue;
          }

          const order = wallet.subscription?.[0]?.order;
          let serverPlanType = order?.planType;
          if (!serverPlanType) {
            logger.warn("SyncPlans: Wallet doesn't have plan type");
            continue;
          }
          serverPlanType = serverPlanType.toLowerCase();

          if (
            !(Object.values(InheritancePlanTypeMap) as any).includes(
              serverPlanType,
            )
          ) {
            logger.warn(`SyncPlans: Unknown plan type ${serverPlanType}`);
            continue;
          }

          const plan: IInheritancePlan = {
            walletId: wallet.wallet,
            walletName: wallet.fullName ?? '',
            isNominee,
            purchasedAt: order?.activationDate
              ? new Date(order.activationDate).getTime()
              : undefined,
            expireAt: order?.expiryDate
              ? new Date(order.expiryDate).getTime()
              : undefined,
            type: serverPlanType as InheritancePlanType,
          };

          await insertInheritancePlan(db, plan);
        }
      }

      setOtpVerificationDetails(undefined);

      return true;
    },
    [startResponse],
  );

  const [verifyEmail, isVerifyingEmail] = useAsync(verifyEmailHandler, onError);

  const onResendOtp = useCallback(async () => {
    // TODO: Implement this function
  }, []);

  const ctx = useMemoReturn({
    onNext,
    onPrevious,
    tabs,
    onClose,
    goTo,
    currentTab,
    currentDialog,
    isDeviceRequired,
    email,
    onEnterEmail: sendEmail,
    isSendingEmail,
    startResponse,
    unhandledError,
    onRetry,
    verifyEmail,
    isVerifyingEmail,
    onResendOtp,
    otpVerificationDetails,
  });

  return (
    <InheritanceSyncPlansDialogContext.Provider value={ctx}>
      {children}
    </InheritanceSyncPlansDialogContext.Provider>
  );
};

export function useInheritanceSyncPlansDialog(): InheritanceSyncPlansDialogContextInterface {
  return useContext(InheritanceSyncPlansDialogContext);
}
