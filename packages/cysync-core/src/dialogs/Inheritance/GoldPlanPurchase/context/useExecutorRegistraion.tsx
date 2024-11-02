import { useState } from 'react';

import { useMemoReturn, useStateWithRef } from '~/hooks';
import { inheritanceLoginService } from '~/services';
import { AuthTokenConfig } from '~/services/utils';

import { tabIndicies } from './useDialogHandler';

import { IUserDetails } from '.';

export const useExecutorRegistration = (
  onError: (e?: any) => void,
  onNext: () => [number, number],
  goTo: (tab: number, dialog?: number) => void,
  isOnSummaryPage: boolean,
  nominees: React.MutableRefObject<Record<number, IUserDetails>>,
  authTokenConfig?: AuthTokenConfig,
) => {
  const [executorDetails, setExecutorDetails, executorDetailsRef] =
    useStateWithRef<IUserDetails | undefined>(undefined);
  const [haveExecutor, setHaveExecutor] = useState(false);
  const [isSubmittingExecutorDetails, setIsSubmittingExecutorDetails] =
    useState(false);
  const [executorNomineeIndex, setExecutorNomineeIndex] = useState<
    number | undefined
  >();
  const [executorMessage, setExecutorMessage] = useState('');

  const onExecutorSelected = () => {
    if (haveExecutor) onNext();
    else goTo(tabIndicies.message.tabNumber, tabIndicies.message.dialogs.video);
  };

  const updateExecutor = async (nomineeIndex: number) => {
    try {
      if (!executorDetailsRef.current) throw 'Invalid executor details';
      if (!authTokenConfig) throw "Wallet auth doesn't have a valid token";

      const result = await inheritanceLoginService.updateExecutor({
        name: executorDetailsRef.current.name,
        email: executorDetailsRef.current.email,
        alternateEmail: executorDetailsRef.current.alternateEmail,
        nomineeEmail: nominees.current[nomineeIndex].email,
        executorMessage,
        authTokenConfig,
      });

      if (!result.result?.success) {
        throw result.error;
      }
      if (isOnSummaryPage) goTo(tabIndicies.summary.tabNumber);
      else onNext();
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
    updateExecutorFields(params, nomineeIndex);
    await updateExecutor(nomineeIndex);
    setIsSubmittingExecutorDetails(false);
  };

  const updateExecutorFields = (params: IUserDetails, nomineeIndex: number) => {
    setExecutorNomineeIndex(nomineeIndex);
    setExecutorDetails(params);
  };

  return useMemoReturn({
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
  });
};
