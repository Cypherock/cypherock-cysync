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
  useRef,
  useState,
} from 'react';

import { routes } from '~/constants';
import {
  useAsync,
  useMemoReturn,
  useNavigateTo,
  useStateWithRef,
} from '~/hooks';
import { inheritancePlanService, InheritanceUserTypeMap } from '~/services';
import { selectLanguage, useAppSelector } from '~/store';
import { getDB } from '~/utils';

import {
  InheritanceSilverPlanPurchaseDialogContextInterface,
  IWalletForSelection,
} from './types';
import { tabIndicies, useSilverPlanDialogHanlders } from './useDialogHandler';

import {
  IUserDetails,
  useEncryptMessage,
  useSession,
  useWalletAuth,
  WalletAuthLoginStep,
} from '../../hooks';

export * from './types';

export const InheritanceSilverPlanPurchaseDialogContext: Context<InheritanceSilverPlanPurchaseDialogContextInterface> =
  createContext<InheritanceSilverPlanPurchaseDialogContextInterface>(
    {} as InheritanceSilverPlanPurchaseDialogContextInterface,
  );

export interface InheritanceSilverPlanPurchaseDialogContextProviderProps {
  children: ReactNode;
}

export const InheritanceSilverPlanPurchaseDialogProvider: FC<
  InheritanceSilverPlanPurchaseDialogContextProviderProps
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
  } = useSilverPlanDialogHanlders();

  const wallets = useAppSelector(state => state.wallet.wallets);
  const lang = useAppSelector(selectLanguage);
  const deletedWallets = useAppSelector(state => state.wallet.deletedWallets);
  const plans = useAppSelector(state => state.inheritance.inheritancePlans);
  const navigateTo = useNavigateTo();

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

  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<IWallet | undefined>();
  const [retryIndex, setRetryIndex] = useState(0);
  const [unhandledError, setUnhandledError] = useState<any>();
  const [coupon, setCoupon, couponRef] = useStateWithRef('');
  const [applyingCouponError, setApplyingCouponError] = useState<
    { heading: string; subtext: string } | undefined
  >();
  const [userDetailPrefillData, setUserDetailPrefillData] =
    useState<IUserDetails>({
      name: '',
      email: '',
      alternateEmail: '',
    });
  const [couponDuration, setCouponDuration] = useState('');

  const onError = useCallback((e?: any) => {
    setUnhandledError(e);
  }, []);

  const clearErrors = useCallback(() => {
    setUnhandledError(undefined);
  }, []);

  const walletAuthService = useWalletAuth(onError, setUserDetailPrefillData);
  const encryptMessageService = useEncryptMessage(onError);
  const sessionService = useSession(onError);
  const sessionIdRef = useRef<string | undefined>();

  const authTokenConfig = useMemo(
    () => walletAuthService.authTokenConfig,
    [walletAuthService],
  );

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
      encryptMessageService.start(selectedWallet.__id);
    }
  }, [
    selectedWallet,
    encryptMessageService.start,
    sessionService.start,
    sessionService.getIsActive,
    sessionService.sessionId,
  ]);

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
    }),
    [],
  );

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
      type: 'silver',
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
        if (result.result.planType !== 'SILVER')
          throw { isForDifferentPlan: true };

        setCouponDuration(result.result.duration ?? '');
        setCoupon(_coupon);
      } catch (error: any) {
        console.log({ error });
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
      type: 'silver',
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
    setUnhandledError(undefined);
    walletAuthService.reset();
    encryptMessageService.reset();
    sessionService.reset();
  }, [
    walletAuthService.reset,
    encryptMessageService.reset,
    resetSetupPlan,
    sessionService.reset,
  ]);

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

  const registerUser = useCallback(
    async (params: IUserDetails) => {
      const isSuccess = await walletAuthService.registerUser({
        ...params,
        walletName: selectedWallet?.name,
      });

      if (isSuccess) {
        goTo(tabIndicies.email.tabNumber, tabIndicies.email.dialogs.verifyOtp);
      }
    },
    [walletAuthService.registerUser, selectedWallet],
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
              tabIndicies.email.tabNumber,
              tabIndicies.email.dialogs.verifyOtp,
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
    sessionService.reset();
    goTo(tabIndicies.wallet.tabNumber, tabIndicies.wallet.dialogs.selectWallet);
  }, [
    walletAuthService.reset,
    encryptMessageService.reset,
    resetSetupPlan,
    sessionService.reset,
  ]);

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
      [tabIndicies.email.tabNumber]: {
        [tabIndicies.email.dialogs.userDetails]: () => {
          fallbackToWalletSelect();
          return true;
        },
        [tabIndicies.email.dialogs.verifyOtp]: () => {
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
    isEstablishingSession: sessionService.isStartingSession,
    isRegisterationRequired: walletAuthService.isRegisterationRequired,
    userDetailPrefillData,
  });

  return (
    <InheritanceSilverPlanPurchaseDialogContext.Provider value={ctx}>
      {children}
    </InheritanceSilverPlanPurchaseDialogContext.Provider>
  );
};

export function useInheritanceSilverPlanPurchaseDialog(): InheritanceSilverPlanPurchaseDialogContextInterface {
  return useContext(InheritanceSilverPlanPurchaseDialogContext);
}
