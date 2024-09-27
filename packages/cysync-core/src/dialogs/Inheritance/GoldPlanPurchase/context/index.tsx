import { insertInheritancePlan } from '@cypherock/cysync-core-services';
import { sleep } from '@cypherock/cysync-utils';
import { IWallet } from '@cypherock/db-interfaces';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useRef,
} from 'react';
import { routes } from '~/constants';

import {
  useAsync,
  useMemoReturn,
  useNavigateTo,
  useStateWithRef,
} from '~/hooks';
import {
  inheritancePlanService,
  inheritanceLoginService,
  InheritanceLoginTypeMap,
} from '~/services';
import { ReminderPeriod } from '~/services/inheritance/login/schema';
import { useAppSelector } from '~/store';
import { getDB } from '~/utils';
import {
  IOtpVerificationDetails,
  OtpVerificationConcern,
  useEncryptMessage,
  useSession,
  useWalletAuth,
  WalletAuthLoginStep,
} from '../../hooks';
import { InheritanceGoldPlanPurchaseDialogContextInterface } from './types';
import { tabIndicies, useGoldPlanDialogHanlders } from './useDialogHandler';

export interface IWalletWithDeleted extends IWallet {
  isDeleted?: boolean;
}

export interface IUserDetails {
  name: string;
  email: string;
  alternateEmail: string;
}

export const InheritanceGoldPlanPurchaseDialogContext: Context<InheritanceGoldPlanPurchaseDialogContextInterface> =
  createContext<InheritanceGoldPlanPurchaseDialogContextInterface>(
    {} as InheritanceGoldPlanPurchaseDialogContextInterface,
  );

export interface InheritanceGoldPlanPurchaseDialogContextProviderProps {
  children: ReactNode;
}

export const InheritanceGoldPlanPurchaseDialogProvider: FC<
  InheritanceGoldPlanPurchaseDialogContextProviderProps
> = ({ children }) => {
  const {
    onClose,
    onNext,
    onPrevious,
    goTo,
    currentTab,
    currentDialog,
    isDeviceRequired,
    tabs,
  } = useGoldPlanDialogHanlders();

  const wallets = useAppSelector(state => state.wallet.wallets);
  const deletedWallets = useAppSelector(state => state.wallet.deletedWallets);

  const allWallets = useMemo<IWalletWithDeleted[]>(() => {
    const deletedWalletIds = deletedWallets.map(e => e.__id);
    return [
      ...wallets.map(e => ({
        ...e,
        isDeleted: deletedWalletIds.includes(e.__id),
      })),
    ];
  }, [wallets, deletedWallets]);

  const [executorDetails, setExecutorDetails, executorDetailsRef] =
    useStateWithRef<IUserDetails | undefined>(undefined);
  const [haveExecutor, setHaveExecutor] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<IWallet | undefined>();
  const [isSubmittingExecutorDetails, setIsSubmittingExecutorDetails] =
    useState(false);
  const [isSubmittingNomineeDetails, setIsSubmittingNomineeDetails] =
    useState(false);
  const [isSubmittingReminderDetails, setIsSubmittingReminderDetails] =
    useState(false);
  const [unhandledError, setUnhandledError] = useState<any>();
  const [nomineeCount, setNomineeCount, nomineeCountRef] = useStateWithRef(1);

  const navigateTo = useNavigateTo();

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [retryIndex, setRetryIndex] = useState(0);
  const [coupon, setCoupon, couponRef] = useStateWithRef('');
  const [applyingCouponError, setApplyingCouponError] = useState<
    { heading: string; subtext: string } | undefined
  >();
  const [couponDuration, setCouponDuration] = useState(0);
  const [nomineeDetails, setNomineeDetails, nominees] = useStateWithRef<
    Record<number, IUserDetails>
  >({});
  const [reminderPeriod, setReminderPeriod] =
    useState<ReminderPeriod>('monthly');
  const [nomineeOtpVerificationDetails, setNomineeOtpVerificationDetails] =
    useState<IOtpVerificationDetails | undefined>();
  const nomineeOtpDetailsRef = useRef<IOtpVerificationDetails[]>([]);
  const [executorNomineeIndex, setExecutorNomineeIndex] = useState<
    number | undefined
  >();

  const updateNominees = async (index: number, verify?: boolean) => {
    try {
      if (!walletAuthService.authTokens)
        throw "Wallet auth doesn't have a valid token";

      const result = await inheritanceLoginService.updateNominees({
        nominee: nominees.current[index],
        verify,
        accessToken: walletAuthService.authTokens?.accessToken,
      });

      if (result?.result?.success === false) {
        throw result?.error ?? 'Nominee update failed';
      }

      if (verify) {
        const otpDetails = result.result?.otpDetails;
        if (!otpDetails) throw 'Invalid data received from server';
        nomineeOtpDetailsRef.current = otpDetails.map((details, idx) => {
          const { requestId, maskedEmail, ...rest } = details;
          return {
            id: requestId,
            email: maskedEmail,
            concern:
              idx === 0
                ? OtpVerificationConcern.primary
                : OtpVerificationConcern.alternate,
            ...rest,
          };
        });

        setNomineeOtpVerificationDetails(nomineeOtpDetailsRef.current.shift());
      }
    } catch (error: any) {
      onError(error);
    }
  };

  const nomineeOtpSubmit = async (secret: string) => {
    setIsSubmittingNomineeDetails(true);
    try {
      if (!walletAuthService.authTokens || !nomineeOtpVerificationDetails)
        throw 'Invalid auth or data';

      const result = await inheritanceLoginService.updateNominees({
        secret,
        requestId: nomineeOtpVerificationDetails?.id,
        accessToken: walletAuthService.authTokens?.accessToken,
      });

      if (result?.result?.success === true) {
        setNomineeOtpVerificationDetails(nomineeOtpDetailsRef.current.shift());
      } else {
        const otpDetails = result.error?.details?.responseBody;
        if (!otpDetails) throw 'Invalid data received from server';
        setNomineeOtpVerificationDetails(old => ({
          ...old!,
          retriesRemaining: otpDetails.retriesRemaining,
          otpExpiry: otpDetails.otpExpiry,
          showIncorrectError: true,
        }));
      }
    } catch (error: any) {
      onError(error);
    }
    setIsSubmittingNomineeDetails(false);
  };

  const updateNomineeDetails = (params: IUserDetails, index: number) => {
    nominees.current[index] = params;
    setNomineeDetails(nominees.current);
  };

  const clearNomineeDetails = () => {
    setNomineeDetails({});
    setNomineeOtpVerificationDetails(undefined);
    setIsSubmittingNomineeDetails(false);
  };

  const onNomineeDetailsSubmit = async (verify: boolean, index: number) => {
    setIsSubmittingNomineeDetails(true);

    await updateNominees(index, verify);

    let nextDialog = tabIndicies.nominieeAndExecutor.dialogs.executorSelect;
    if (nomineeCountRef.current === 2 && index === 0)
      nextDialog = tabIndicies.nominieeAndExecutor.dialogs.secondNomineeDetails;

    if (verify) {
      onNext();
    } else {
      goTo(tabIndicies.nominieeAndExecutor.tabNumber, nextDialog);
    }

    setIsSubmittingNomineeDetails(false);
  };

  const onExecutorSelected = useCallback(() => {
    if (haveExecutor) onNext();
    else goTo(tabIndicies.message.tabNumber, tabIndicies.message.dialogs.video);
  }, [haveExecutor]);

  const updateExecutor = async (nomineeIndex: number) => {
    try {
      if (!executorDetailsRef.current) throw 'Invalid executor details';
      if (!walletAuthService.authTokens)
        throw "Wallet auth doesn't have a valid token";

      setExecutorNomineeIndex(nomineeIndex);

      const result = await inheritanceLoginService.updateExecutor({
        name: executorDetailsRef.current.name,
        email: executorDetailsRef.current.email,
        alternateEmail: executorDetailsRef.current.alternateEmail,
        nomineeEmail: nominees.current[nomineeIndex]?.email,
        accessToken: walletAuthService.authTokens?.accessToken,
        executorMessage,
      });

      if (!result?.result?.success) {
        throw result?.error;
      }
      onNext();
    } catch (error: any) {
      onError(error);
    }
  };

  const onExecutorMessageSubmit = async () => {
    setIsSubmittingExecutorDetails(true);
    await updateExecutor(executorNomineeIndex ?? 0);
    setIsSubmittingExecutorDetails(false);
  };

  const onExecutorDetailsSubmit = async (
    params: IUserDetails,
    nomineeIndex: number,
  ) => {
    setIsSubmittingExecutorDetails(true);
    setExecutorDetails(params);
    await updateExecutor(nomineeIndex);
    setIsSubmittingExecutorDetails(false);
  };

  const onReminderDetailsSubmit = async () => {
    setIsSubmittingReminderDetails(true);
    try {
      if (!walletAuthService.authTokens)
        throw "Wallet auth doesn't have a valid token";

      const result = await inheritanceLoginService.updateReminder({
        frequency: reminderPeriod,
        accessToken: walletAuthService.authTokens?.accessToken,
      });

      if (result?.result?.success === false) {
        throw result?.error ?? 'ReminderPeriod update failed';
      }
      onNext();
    } catch (error: any) {
      onError(error);
    }
    setIsSubmittingReminderDetails(false);
  };

  const onError = useCallback((e?: any) => {
    setUnhandledError(e);
  }, []);

  const clearErrors = useCallback(() => {
    setUnhandledError(undefined);
  }, []);

  const walletAuthService = useWalletAuth(onError);
  const encryptMessageService = useEncryptMessage(onError);
  const sessionService = useSession(onError);
  const sessionIdRef = useRef<string | undefined>();

  const onRetryFuncMap = useMemo<
    Record<number, Record<number, (() => boolean) | undefined> | undefined>
  >(
    () => ({
      [tabIndicies.wallet.tabNumber]: {
        [tabIndicies.wallet.dialogs.fetchRequestId]: () => true,
        [tabIndicies.wallet.dialogs.walletAuth]: () => true,
        [tabIndicies.wallet.dialogs.validateSignature]: () => true,
      },
      [tabIndicies.encryption.tabNumber]: {
        [tabIndicies.encryption.dialogs.deviceEncryption]: () => true,
        [tabIndicies.encryption.dialogs.encryptionLoader]: () => true,
      },
    }),
    [],
  );

  const onRetry = useCallback(() => {
    const retryLogic = onRetryFuncMap[currentTab]?.[currentDialog];

    if (retryLogic) {
      setRetryIndex(v => v + 1);
      retryLogic();
    } else {
      resetAll();
      goTo(0, 0);
    }

    setUnhandledError(undefined);
  }, [currentTab, currentDialog, onRetryFuncMap, walletAuthService.reset]);

  const walletAuthFetchRequestId = useCallback(() => {
    if (!selectedWallet?.__id) {
      return;
    }

    walletAuthService.fetchRequestId(
      selectedWallet.__id,
      InheritanceLoginTypeMap.owner,
      'seed-based',
    );
  }, [selectedWallet, walletAuthService.fetchRequestId]);

  const encryptPinStart = useCallback(async () => {
    if (!selectedWallet?.__id) {
      return;
    }

    let sessionId = await sessionService.getIsActive();

    if (!sessionId) {
      sessionId = await sessionService.start();
    }

    sessionIdRef.current = sessionId;

    if (sessionId) {
      encryptMessageService.start(selectedWallet.__id, {
        personalMessage,
        cardLocation,
      });
    }
  }, [
    selectedWallet,
    encryptMessageService.start,
    sessionService.start,
    sessionService.getIsActive,
    sessionService.sessionId,
  ]);

  const setupPlanHandler = useCallback(async () => {
    if (
      !encryptMessageService.encryptedMessages ||
      !walletAuthService.authTokens ||
      !selectedWallet ||
      !sessionIdRef.current
    )
      return false;

    const result = await inheritancePlanService.create({
      encryptedData: encryptMessageService.encryptedMessages,
      sessionId: sessionIdRef.current,
      accessToken: walletAuthService.authTokens.accessToken,
    });

    if (result.error) {
      throw result.error;
    }

    const db = getDB();
    await insertInheritancePlan(db, {
      walletId: selectedWallet.__id ?? '',
      isNominee: false,
      type: 'gold',
      walletName: selectedWallet.name,
    });

    return true;
  }, [
    encryptMessageService.encryptedMessages,
    walletAuthService.authTokens,
    selectedWallet,
  ]);

  const [setupPlan, isSettingUpPlan, isSetupPlanCompleted, resetSetupPlan] =
    useAsync(setupPlanHandler, onError);

  const applyCouponHandler = useCallback(
    async (_coupon: string) => {
      setApplyingCouponError(undefined);

      if (!walletAuthService.authTokens) return false;

      /*
       * TODO: Uncomment when implemented on server
        const result = await inheritancePlanService.applyCoupon({
          coupon: _coupon,
          accessToken: walletAuthService.authTokens.accessToken,
        });

        if (result.error) {
          throw result.error;
        }
     */

      await sleep(2000);
      setCoupon(_coupon);
      setCouponDuration(2);

      return true;
    },
    [walletAuthService.authTokens, onNext],
  );

  const [applyCoupon, isApplyingCoupon, isCouponApplied, resetApplyCoupon] =
    useAsync(applyCouponHandler, onError);

  const activateCouponHandler = useCallback(async () => {
    if (!walletAuthService.authTokens || !couponRef.current || !selectedWallet)
      return false;

    const result = await inheritancePlanService.activate({
      coupon: couponRef.current,
      accessToken: walletAuthService.authTokens.accessToken,
    });

    if (result.error) {
      throw result.error;
    }

    const db = getDB();
    await insertInheritancePlan(db, {
      walletId: selectedWallet.__id ?? '',
      isNominee: false,
      type: 'gold',
      walletName: selectedWallet.name,
      purchasedAt: Date.now(),
      expireAt: Date.now() + 1000 * 60 * 60 * 24 * 365 * couponDuration,
    });

    return true;
  }, [walletAuthService.authTokens, selectedWallet, couponDuration]);

  const [
    activateCoupon,
    isActivatingCoupon,
    isCouponActivated,
    resetActivateCoupon,
  ] = useAsync(activateCouponHandler, onError);

  const removeCoupon = useCallback(() => {
    setCoupon('');
    resetApplyCoupon();
    resetActivateCoupon();
  }, []);

  const resetAll = useCallback(() => {
    resetSetupPlan();
    resetApplyCoupon();
    resetActivateCoupon();
    setApplyingCouponError(undefined);
    setCoupon('');
    setCouponDuration(0);
    setSelectedWallet(undefined);
    setRetryIndex(v => v + 1);
    walletAuthService.reset();
    encryptMessageService.reset();
    sessionService.reset();
  }, [walletAuthService.reset, encryptMessageService.reset, resetSetupPlan]);

  const registerUser = useCallback(
    async (params: IUserDetails) => {
      const isSuccess = await walletAuthService.registerUser(params);

      if (isSuccess) {
        setUserDetails(params);
        goTo(tabIndicies.owner.tabNumber, tabIndicies.owner.dialogs.verifyOtp);
      }
    },
    [walletAuthService.registerUser],
  );

  const onNextActionMapPerDialog = useMemo<
    Record<number, Record<number, (() => boolean) | undefined> | undefined>
  >(
    () => ({
      [tabIndicies.wallet.tabNumber]: {
        [tabIndicies.wallet.dialogs.fetchRequestId]: () => {
          if (walletAuthService.currentStep === WalletAuthLoginStep.completed) {
            goTo(
              tabIndicies.encryption.tabNumber,
              tabIndicies.encryption.dialogs.deviceEncryption,
            );
            return true;
          }

          return false;
        },
        [tabIndicies.wallet.dialogs.validateSignature]: () => {
          if (!walletAuthService.isRegisterationRequired) {
            goTo(
              tabIndicies.owner.tabNumber,
              tabIndicies.owner.dialogs.verifyOtp,
            );
            return true;
          }

          return false;
        },
      },
    }),
    [walletAuthService.isRegisterationRequired, walletAuthService.currentStep],
  );

  const fallbackToWalletSelect = useCallback(() => {
    resetSetupPlan();
    resetApplyCoupon();
    resetActivateCoupon();
    setRetryIndex(v => v + 1);
    walletAuthService.reset();
    encryptMessageService.reset();
    goTo(tabIndicies.wallet.tabNumber, tabIndicies.wallet.dialogs.selectWallet);
  }, [walletAuthService.reset, encryptMessageService.reset, resetSetupPlan]);

  const onNextCallback = useCallback(() => {
    const action = onNextActionMapPerDialog[currentTab]?.[currentDialog];

    let doNext = true;

    if (action) {
      doNext = !action();
    }

    if (doNext) {
      onNext();
    }
  }, [onNext, currentTab, currentDialog]);

  const onPreviousActionMapPerDialog = useMemo<
    Record<number, Record<number, (() => boolean) | undefined> | undefined>
  >(
    () => ({
      [tabIndicies.owner.tabNumber]: {
        [tabIndicies.owner.dialogs.userDetails]: () => {
          fallbackToWalletSelect();
          return true;
        },
        [tabIndicies.owner.dialogs.verifyOtp]: () => {
          fallbackToWalletSelect();
          return true;
        },
      },
    }),
    [fallbackToWalletSelect],
  );

  const onPreviousCallback = useCallback(() => {
    const action = onPreviousActionMapPerDialog[currentTab]?.[currentDialog];

    let doPrevious = true;

    if (action) {
      doPrevious = !action();
    }

    if (doPrevious) {
      onPrevious();
    }
  }, [onPrevious, currentTab, currentDialog]);

  const onCloseCallback = useCallback(() => {
    if (isSetupPlanCompleted || isCouponActivated) {
      navigateTo(routes.inheritance.home.path);
    }

    onClose();
  }, [isSetupPlanCompleted, isCouponActivated, onClose]);

  const [personalMessage, setPersonalMessage] = useState('');
  const [cardLocation, setCardLocation] = useState('');
  const [executorMessage, setExecutorMessage] = useState('');
  const [userDetails, setUserDetails] = useState<IUserDetails>();

  const ctx = useMemoReturn({
    onNext: onNextCallback,
    onPrevious: onPreviousCallback,
    onClose: onCloseCallback,
    tabs,
    goTo,
    currentTab,
    currentDialog,
    isDeviceRequired,
    allWallets,
    selectedWallet,
    setSelectedWallet,
    registerUser,
    unhandledError,
    onRetry,
    retryIndex,
    clearErrors,
    walletAuthDeviceEvents: walletAuthService.deviceEvents,
    walletAuthFetchRequestId,
    walletAuthIsFetchingRequestId: walletAuthService.isFetchingRequestId,
    walletAuthStart: walletAuthService.startWalletAuth,
    walletAuthValidateSignature: walletAuthService.validateSignature,
    walletAuthIsValidatingSignature: walletAuthService.isValidatingSignature,
    walletAuthStep: walletAuthService.currentStep,
    walletAuthAbort: walletAuthService.abortWalletAuth,
    onRegister: walletAuthService.registerUser,
    isRegisteringUser: walletAuthService.isRegisteringUser,
    otpVerificationDetails: walletAuthService.otpVerificationDetails,
    verifyOtp: walletAuthService.verifyOtp,
    isVerifyingOtp: walletAuthService.isVerifyingOtp,
    encryptPinStart,
    encryptPinAbort: encryptMessageService.abort,
    encryptPinDeviceEvents: encryptMessageService.deviceEvents,
    encryptPinIsCompleted: encryptMessageService.isEncrypted,
    setupPlan,
    isSettingUpPlan,
    isSetupPlanCompleted,
    isTermsAccepted,
    setIsTermsAccepted,
    coupon,
    applyCoupon,
    isApplyingCoupon,
    isCouponApplied,
    activateCoupon,
    isActivatingCoupon,
    isCouponActivated,
    removeCoupon,
    applyingCouponError,
    couponDuration,
    onNomineeDetailsSubmit,
    isSubmittingNomineeDetails,
    onExecutorDetailsSubmit,
    isSubmittingExecutorDetails,
    executorDetails,
    nomineeCount,
    setNomineeCount,
    haveExecutor,
    setHaveExecutor,
    onExecutorSelected,
    personalMessage,
    setPersonalMessage,
    cardLocation,
    setCardLocation,
    executorMessage,
    setExecutorMessage,
    nomineeDetails,
    userDetails,
    isEstablishingSession: sessionService.isStartingSession,
    isRegisterationRequired: walletAuthService.isRegisterationRequired,
    reminderPeriod,
    setReminderPeriod,
    isSubmittingReminderDetails,
    onReminderDetailsSubmit,
    updateNomineeDetails,
    nomineeOtpSubmit,
    clearNomineeDetails,
    nomineeOtpVerificationDetails,
    onExecutorMessageSubmit,
  });

  return (
    <InheritanceGoldPlanPurchaseDialogContext.Provider value={ctx}>
      {children}
    </InheritanceGoldPlanPurchaseDialogContext.Provider>
  );
};

export function useInheritanceGoldPlanPurchaseDialog(): InheritanceGoldPlanPurchaseDialogContextInterface {
  return useContext(InheritanceGoldPlanPurchaseDialogContext);
}
