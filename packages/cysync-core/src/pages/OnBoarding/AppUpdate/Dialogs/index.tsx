import {
  AppUpdateIcon,
  ConfirmationDialog,
  ErrorDialog,
  ProgressDialog,
  SuccessDialog,
} from '@cypherock/cysync-ui';
import React, { FC, ReactElement } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { AppUpdateFailedFallback } from './AppUpdateFailedFallback';

enum AppUpdateStates {
  Confirmation,
  Updating,
  Successful,
  Failed,
  FailedFallback,
}

export const AppUpdateDialogBox: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const maxTries = 3;
  const [state, setState] = React.useState(AppUpdateStates.Confirmation);
  const [tries, setTries] = React.useState(0);
  const onConfirm = () => {
    setState(AppUpdateStates.Updating);
  };

  const onUpdate = () => {
    setState(AppUpdateStates.Successful);
  };

  const onRetry = () => {
    if (tries < maxTries) {
      setState(AppUpdateStates.Updating);
      setTries(tries + 1);
    } else {
      setState(AppUpdateStates.FailedFallback);
    }
  };

  const AppUpdateDialogs: Record<AppUpdateStates, ReactElement> = {
    [AppUpdateStates.Confirmation]: (
      <ConfirmationDialog
        title={lang.strings.onboarding.appUpdate.dialogs.confirmation.title}
        subtext={lang.strings.onboarding.appUpdate.dialogs.confirmation.subtext}
        buttonText={lang.strings.buttons.update}
        icon={<AppUpdateIcon />}
        handleClick={onConfirm}
      />
    ),
    [AppUpdateStates.Updating]: (
      <ProgressDialog
        title={lang.strings.onboarding.appUpdate.dialogs.updating.heading}
        subtext={lang.strings.onboarding.appUpdate.dialogs.updating.subtext}
        icon={<AppUpdateIcon />}
        handleComplete={onUpdate}
      />
    ),
    [AppUpdateStates.Successful]: (
      <SuccessDialog
        title={
          lang.strings.onboarding.appUpdate.dialogs.updateSuccessful.heading
        }
        subtext={
          lang.strings.onboarding.appUpdate.dialogs.updateSuccessful.subtext
        }
        alertText={
          lang.strings.onboarding.appUpdate.dialogs.updateSuccessful.bubbleText
        }
      />
    ),
    [AppUpdateStates.Failed]: (
      <ErrorDialog
        title={lang.strings.onboarding.appUpdate.dialogs.updateFailed.heading}
        subtext={lang.strings.onboarding.appUpdate.dialogs.updateFailed.subtext}
        onRetry={onRetry}
        showRetry
      />
    ),
    [AppUpdateStates.FailedFallback]: (
      <AppUpdateFailedFallback
        title={
          lang.strings.onboarding.appUpdate.dialogs.updateFailedFallback.heading
        }
        subtext={
          lang.strings.onboarding.appUpdate.dialogs.updateFailedFallback.subtext
        }
        linkText="download Link"
        alertText={
          lang.strings.onboarding.appUpdate.dialogs.updateFailedFallback
            .alertText
        }
      />
    ),
  };

  return AppUpdateDialogs[state];
};
