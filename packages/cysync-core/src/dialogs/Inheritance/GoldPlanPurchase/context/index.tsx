import { insertInheritancePlan } from '@cypherock/cysync-core-services';
import { IInheritancePlan, IWallet } from '@cypherock/db-interfaces';
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
  useEffect,
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
  InheritanceUserTypeMap,
} from '~/services';
import { ReminderPeriod } from '~/services/inheritance/login/schema';
import { selectLanguage, useAppSelector } from '~/store';
import { getDB } from '~/utils';

import {
  InheritanceGoldPlanPurchaseDialogContextInterface,
  IWalletForSelection,
} from './types';
import { tabIndicies, useGoldPlanDialogHanlders } from './useDialogHandler';
import { useExecutorRegistration } from './useExecutorRegistraion';
import { useNomineeRegistration } from './useNomineeRegistration';

import {
  useEncryptMessage,
  useSession,
  useWalletAuth,
  WalletAuthLoginStep,
} from '../../hooks';

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
  const lang = useAppSelector(selectLanguage);
  const deletedWallets = useAppSelector(state => state.wallet.deletedWallets);
  const plans = useAppSelector(state => state.inheritance.inheritancePlans);

  const isPlanActive = (plan: IInheritancePlan, walletId: string) => {
    const now = Date.now();
    return (
      plan.walletId === walletId &&
      plan.purchasedAt &&
      plan.purchasedAt <= now &&
      plan.expireAt &&
      plan.expireAt >= now
    );
  };

  const allWallets = useMemo<IWalletForSelection[]>(() => {
    const deletedWalletIds = deletedWallets.map(e => e.__id);
    return wallets.map(e => ({
      ...e,
      isDeleted: deletedWalletIds.includes(e.__id),
      isActive: plans.some(plan => e.__id && isPlanActive(plan, e.__id)),
    }));
  }, [wallets, deletedWallets, plans]);

  const [selectedWallet, setSelectedWallet] = useState<IWallet | undefined>();
  const [isSubmittingReminderDetails, setIsSubmittingReminderDetails] =
    useState(false);
  const [unhandledError, setUnhandledError] = useState<any>();

  const navigateTo = useNavigateTo();

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [retryIndex, setRetryIndex] = useState(0);
  const [coupon, setCoupon, couponRef] = useStateWithRef('');
  const [applyingCouponError, setApplyingCouponError] = useState<
    { heading: string; subtext: string } | undefined
  >();
  const [couponDuration, setCouponDuration] = useState('');
  const [reminderPeriod, setReminderPeriod] =
    useState<ReminderPeriod>('monthly');

  const onReminderDetailsSubmit = async () => {
    setIsSubmittingReminderDetails(true);
    try {
      if (!authTokenConfig) throw "Wallet auth doesn't have a valid token";

      const result = await inheritanceLoginService.updateReminder({
        frequency: reminderPeriod,
        authTokenConfig,
      });

      if (result.result?.success === false) {
        throw result.error ?? 'ReminderPeriod update failed';
      }

      if (!userDetails) {
        const planDetailsResult = await inheritancePlanService.getPlan({
          authTokenConfig,
        });

        if (planDetailsResult.error) {
          throw result.error ?? "Couldn't fetch plan details";
        }
        const fetchedDetails = {
          name: planDetailsResult.result.fullName,
          ...planDetailsResult.result.owner,
        } as IUserDetails;

        setUserDetails(fetchedDetails);
      }

      onNext();
    } catch (error: any) {
      onError(error);
    }
    setIsSubmittingReminderDetails(false);
  };

  const [isFetchingDetails, setIsFetchingDetails] = useState(false);

  const fetchExistingDetailsFromServer = async () => {
    if (isFetchingDetails) return;
    if (!authTokenConfig) throw "Wallet auth doesn't have a valid token";
    setIsFetchingDetails(true);
    const result = await inheritancePlanService.getPlan({
      authTokenConfig,
    });

    if (result.error) {
      setIsFetchingDetails(false);
      throw result.error ?? "Couldn't fetch plan details";
    }
    const fetchedDetails = {
      ...result.result.owner,
    } as IUserDetails;
    setUserDetails(fetchedDetails);

    const fetchedNomineeDetails = result.result.nominee;
    if (fetchedNomineeDetails) {
      setNomineeCount(fetchedNomineeDetails.length);
      fetchedNomineeDetails.forEach((details, index) =>
        updateNomineeDetails(details as IUserDetails, index),
      );
    }

    const fetchedExecutorDetails = result.result.executor;
    if (fetchedExecutorDetails) {
      const nomineeIndex = Math.max(
        fetchedNomineeDetails
          ?.map(details => details.email)
          .indexOf(fetchedExecutorDetails.nominee?.[0]) ?? 0,
        0,
      );
      setHaveExecutor(true);
      updateExecutorFields(
        fetchedExecutorDetails as IUserDetails,
        nomineeIndex,
      );
    }

    if (result.result.emailConfig?.frequency)
      setReminderPeriod(
        (result.result.emailConfig.frequency as ReminderPeriod) ?? 'monthly',
      );
    setIsFetchingDetails(false);
  };

  const onError = useCallback((e?: any) => {
    setUnhandledError(e);
  }, []);

  const clearErrors = useCallback(() => {
    setUnhandledError(undefined);
  }, []);

  const [userDetailPrefillData, setUserDetailPrefillData] =
    useState<IUserDetails>({
      name: '',
      email: '',
      alternateEmail: '',
    });

  const walletAuthService = useWalletAuth(onError, setUserDetailPrefillData);
  const encryptMessageService = useEncryptMessage(onError);
  const sessionService = useSession(onError);
  const sessionIdRef = useRef<string | undefined>();

  const authTokenConfig = useMemo(
    () => walletAuthService.authTokenConfig,
    [walletAuthService],
  );
  const onRetryFuncMap = useMemo<
    Record<number, Record<number, (() => boolean) | undefined> | undefined>
  >(
    () => ({
      [tabIndicies.instructions.tabNumber]: {
        [tabIndicies.instructions.dialogs.video]: () => true,
      },
      [tabIndicies.wallet.tabNumber]: {
        [tabIndicies.wallet.dialogs.fetchRequestId]: () => true,
        [tabIndicies.wallet.dialogs.walletAuth]: () => true,
        [tabIndicies.wallet.dialogs.validateSignature]: () => true,
      },
      [tabIndicies.encryption.tabNumber]: {
        [tabIndicies.encryption.dialogs.deviceEncryption]: () => true,
        [tabIndicies.encryption.dialogs.encryptionLoader]: () => true,
      },
      [tabIndicies.message.tabNumber]: {
        [tabIndicies.message.dialogs.video]: () => true,
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
      goTo(0);
    }

    setUnhandledError(undefined);
  }, [currentTab, currentDialog, onRetryFuncMap, walletAuthService.reset]);

  const walletAuthFetchRequestId = useCallback(() => {
    if (!selectedWallet?.__id) {
      return;
    }

    walletAuthService.fetchRequestId(
      selectedWallet.__id,
      InheritanceUserTypeMap.owner,
      'seed-based',
      true,
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
  }, [selectedWallet, encryptMessageService, sessionService]);

  const setupPlanHandler = useCallback(async () => {
    if (
      !encryptMessageService.encryptedMessages ||
      !authTokenConfig ||
      !selectedWallet ||
      !sessionIdRef.current
    )
      return false;

    const result = await inheritancePlanService.create({
      encryptedData: encryptMessageService.encryptedMessages,
      sessionId: sessionIdRef.current,
      authTokenConfig,
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
    authTokenConfig,
    selectedWallet,
  ]);

  const [setupPlan, isSettingUpPlan, isSetupPlanCompleted, resetSetupPlan] =
    useAsync(setupPlanHandler, onError);

  const applyCouponHandler = useCallback(
    async (_coupon: string) => {
      setApplyingCouponError(undefined);

      if (!authTokenConfig) return false;

      try {
        const result = await inheritancePlanService.checkCoupon({
          coupon: _coupon,
          authTokenConfig,
        });

        if (result.error) throw result.error;
        if (result.result.planType !== 'GOLD')
          throw { isForDifferentPlan: true };

        setCouponDuration(result.result.duration ?? '');
        setCoupon(_coupon);
      } catch (error: any) {
        setApplyingCouponError({
          heading: lang.strings.inheritance.dialog.payment.error.errorHeading,
          subtext: error?.isForDifferentPlan
            ? lang.strings.inheritance.dialog.payment.error.differentPlanSubtext
            : lang.strings.inheritance.dialog.payment.error.subtext,
        });
        return false;
      }

      return true;
    },
    [authTokenConfig, onNext],
  );

  const [applyCoupon, isApplyingCoupon, isCouponApplied, resetApplyCoupon] =
    useAsync(applyCouponHandler, onError);

  const activateCouponHandler = useCallback(async () => {
    if (!authTokenConfig || !couponRef.current || !selectedWallet) return false;

    const result = await inheritancePlanService.activate({
      coupon: couponRef.current,
      authTokenConfig,
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
      expireAt:
        Date.now() +
        1000 * 60 * 60 * 24 * 365 * parseInt(couponDuration.split(' ')[0], 10),
    });

    return true;
  }, [authTokenConfig, selectedWallet, couponDuration]);

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
    setCouponDuration('');
    setSelectedWallet(undefined);
    setRetryIndex(v => v + 1);
    setIsOnSummaryPage(false);
    walletAuthService.reset();
    encryptMessageService.reset();
    sessionService.reset();
  }, [walletAuthService.reset, encryptMessageService.reset, resetSetupPlan]);

  const registerUser = useCallback(
    async (params: IUserDetails) => {
      const isSuccess = await walletAuthService.registerUser({
        ...params,
        walletName: selectedWallet?.name,
      });

      if (isSuccess) {
        setUserDetails(params);
        goTo(tabIndicies.owner.tabNumber, tabIndicies.owner.dialogs.verifyOtp);
      }
    },
    [walletAuthService.registerUser, selectedWallet],
  );

  const [personalMessage, setPersonalMessage] = useState('');
  const [cardLocation, setCardLocation] = useState('');
  const [userDetails, setUserDetails] = useState<IUserDetails>();
  const [isOnSummaryPage, setIsOnSummaryPage] = useState(false);

  const {
    onNomineeDetailsSubmit,
    isSubmittingNomineeDetails,
    nomineeCount,
    setNomineeCount,
    nomineeDetails,
    updateNomineeDetails,
    nomineeOtpSubmit,
    clearNomineeDetails,
    nomineeOtpVerificationDetails,
    nominees,
    onNomineeOtpSubmit,
  } = useNomineeRegistration(
    onError,
    onNext,
    goTo,
    isOnSummaryPage,
    authTokenConfig,
  );

  useEffect(() => {
    if (nomineeCount === 1 && authTokenConfig !== undefined) {
      inheritanceLoginService.clearMetaData({
        resetNominee: true,
        authTokenConfig,
      });
    }
  }, [nomineeCount]);

  const {
    haveExecutor,
    setHaveExecutor,
    onExecutorSelected,
    onExecutorDetailsSubmit,
    isSubmittingExecutorDetails,
    executorNomineeIndex,
    executorDetails,
    executorMessage,
    setExecutorMessage,
    onExecutorMessageSubmit,
    updateExecutorFields,
  } = useExecutorRegistration(
    onError,
    onNext,
    goTo,
    isOnSummaryPage,
    nominees,
    authTokenConfig,
  );

  useEffect(() => {
    if (!haveExecutor && authTokenConfig !== undefined) {
      inheritanceLoginService.clearMetaData({
        resetExecutor: true,
        authTokenConfig,
      });
    }
  }, [haveExecutor]);

  const onNextActionMapPerDialog = useMemo<
    Record<number, Record<number, (() => boolean) | undefined> | undefined>
  >(
    () => ({
      [tabIndicies.wallet.tabNumber]: {
        [tabIndicies.wallet.dialogs.fetchRequestId]: () => {
          if (walletAuthService.currentStep === WalletAuthLoginStep.completed) {
            goTo(tabIndicies.nominieeAndExecutor.tabNumber);
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
      [tabIndicies.nominieeAndExecutor.tabNumber]: {
        [tabIndicies.nominieeAndExecutor.dialogs.nomineeCountSelect]: () => {
          fallbackToWalletSelect();
          return true;
        },
        [tabIndicies.nominieeAndExecutor.dialogs.executorSelect]: () => {
          if (nomineeCount === 2) {
            goTo(
              tabIndicies.nominieeAndExecutor.tabNumber,
              tabIndicies.nominieeAndExecutor.dialogs.secondNomineeDetails,
            );
          } else {
            goTo(
              tabIndicies.nominieeAndExecutor.tabNumber,
              tabIndicies.nominieeAndExecutor.dialogs.firstNomineeDetails,
            );
          }
          return true;
        },
      },
      [tabIndicies.message.tabNumber]: {
        [tabIndicies.message.dialogs.video]: () => {
          if (!haveExecutor) {
            goTo(
              tabIndicies.nominieeAndExecutor.tabNumber,
              tabIndicies.nominieeAndExecutor.dialogs.executorSelect,
            );
            return true;
          }
          return false;
        },
      },
      [tabIndicies.reminder.tabNumber]: {
        [tabIndicies.reminder.dialogs.reminderInput]: () => {
          if (!haveExecutor) {
            goTo(
              tabIndicies.message.tabNumber,
              tabIndicies.message.dialogs.personalMessageInput,
            );
            return true;
          }
          return false;
        },
      },
    }),
    [fallbackToWalletSelect, haveExecutor, nomineeCount],
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

  const overriddenCurrentMilestone = useMemo(
    () => (isOnSummaryPage ? tabIndicies.summary.tabNumber : undefined),
    [isOnSummaryPage],
  );

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
    walletAuthReset: walletAuthService.reset,
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
    nomineeCount,
    setNomineeCount,
    personalMessage,
    setPersonalMessage,
    cardLocation,
    setCardLocation,
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
    overriddenCurrentMilestone,
    isOnSummaryPage,
    setIsOnSummaryPage,
    haveExecutor,
    setHaveExecutor,
    onExecutorSelected,
    onExecutorDetailsSubmit,
    isSubmittingExecutorDetails,
    executorNomineeIndex,
    executorDetails,
    executorMessage,
    setExecutorMessage,
    onExecutorMessageSubmit,
    fetchExistingDetailsFromServer,
    userDetailPrefillData,
    onNomineeOtpSubmit,
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
