import { useRef, useState } from 'react';

import { useMemoReturn, useStateWithRef } from '~/hooks';
import { inheritanceLoginService } from '~/services';
import { AuthTokenConfig } from '~/services/utils';

import { tabIndicies } from './useDialogHandler';

import { IOtpVerificationDetails, OtpVerificationConcern } from '../../hooks';

import { IUserDetails } from '.';

export const useNomineeRegistration = (
  onError: (e?: any) => void,
  onNext: () => [number, number],
  goTo: (tab: number, dialog?: number) => void,
  isOnSummaryPage: boolean,
  authTokenConfig?: AuthTokenConfig,
) => {
  const [isSubmittingNomineeDetails, setIsSubmittingNomineeDetails] =
    useState(false);
  const [nomineeCount, setNomineeCount, nomineeCountRef] = useStateWithRef(0);
  const [nomineeDetails, setNomineeDetails, nominees] = useStateWithRef<
    Record<number, IUserDetails>
  >({});
  const [nomineeOtpVerificationDetails, setNomineeOtpVerificationDetails] =
    useState<IOtpVerificationDetails | undefined>();
  const nomineeOtpDetailsRef = useRef<IOtpVerificationDetails[]>([]);

  const updateNominees = async (index: number, verify?: boolean) => {
    try {
      if (!authTokenConfig) throw "Wallet auth doesn't have a valid token";

      const result = await inheritanceLoginService.updateNominees({
        nominee: nominees.current[index],
        verify,
        nomineeType: index === 0 ? 'PRIMARY' : 'ALTERNATE',
        authTokenConfig,
      });

      if (result.result?.success === false) {
        throw result.error ?? 'Nominee update failed';
      }

      if (verify) {
        const otpDetails = result.result?.otpDetails;
        if (!otpDetails) throw 'Invalid data received from server';
        nomineeOtpDetailsRef.current = otpDetails.map((details, idx) => {
          const { requestId, maskedEmail, ...rest } = details;
          return {
            id: requestId,
            emails: [maskedEmail],
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
      if (!authTokenConfig || !nomineeOtpVerificationDetails)
        throw 'Invalid auth or data';

      const result = await inheritanceLoginService.updateNominees({
        secret,
        requestId: nomineeOtpVerificationDetails.id,
        authTokenConfig,
      });

      if (result.result?.success === true) {
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

    if (verify) onNext();
    else if (isOnSummaryPage) goTo(tabIndicies.summary.tabNumber);
    else goTo(tabIndicies.nominieeAndExecutor.tabNumber, nextDialog);

    setIsSubmittingNomineeDetails(false);
  };

  const onNomineeOtpSubmit = (index: number) => {
    let nextDialog = tabIndicies.nominieeAndExecutor.dialogs.executorSelect;
    if (nomineeCountRef.current === 2 && index === 0)
      nextDialog = tabIndicies.nominieeAndExecutor.dialogs.secondNomineeDetails;

    if (isOnSummaryPage) goTo(tabIndicies.summary.tabNumber);
    else goTo(tabIndicies.nominieeAndExecutor.tabNumber, nextDialog);
  };

  return useMemoReturn({
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
  });
};
