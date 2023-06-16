import React, { FC } from 'react';
import { selectLanguage, useAppSelector } from '~/store';
import {
  AppUpdateIcon,
  UpdatingDialog,
  SuccessDialog,
  FailedDialog,
  UpdateConfirmationDialog,
} from '@cypherock/cysync-ui';
import { AppUpdateFailedFallback } from './AppUpdateFailedFallback';

enum appUpdateStates {
  confirmation,
  updating,
  successful,
  failed,
  failedFallback,
}

interface AppUpdateDialogBoxProps {
  setBack: (back: boolean) => void;
}

export const AppUpdateDialogBox: FC<AppUpdateDialogBoxProps> = ({
  setBack,
}) => {
  const lang = useAppSelector(selectLanguage);
  const maxTries = 3;
  const [state, setState] = React.useState(appUpdateStates.confirmation);
  const [tries, setTries] = React.useState(0);
  const onConfirm = () => {
    setBack(false);
    setState(appUpdateStates.updating);
  };

  const onUpdate = () => {
    setState(appUpdateStates.successful);
  };

  const onRetry = () => {
    console.log(tries);
    if (tries < maxTries) {
      setState(appUpdateStates.updating);
      setTries(tries + 1);
    } else {
      setState(appUpdateStates.failedFallback);
    }
  };

  switch (state) {
    case appUpdateStates.confirmation:
      return (
        <UpdateConfirmationDialog
          title={lang.strings.onboarding.appUpdate.title}
          subtext={lang.strings.onboarding.appUpdate.subtext}
          buttonText={lang.strings.buttons.update}
          Icon={AppUpdateIcon}
          handleClick={onConfirm}
        />
      );
    case appUpdateStates.updating:
      return (
        <UpdatingDialog
          title={lang.strings.onboarding.appUpdating.heading}
          subtext={lang.strings.onboarding.appUpdating.subtext}
          Icon={AppUpdateIcon}
          handleComplete={onUpdate}
        />
      );
    case appUpdateStates.successful:
      return (
        <SuccessDialog
          title={lang.strings.onboarding.appUpdateSuccessful.heading}
          subtext={lang.strings.onboarding.appUpdateSuccessful.subtext}
          alertText={lang.strings.onboarding.appUpdateSuccessful.bubbleText}
        />
      );
    case appUpdateStates.failed:
      return (
        <FailedDialog
          title={lang.strings.onboarding.appUpdateFailed.heading}
          subtext={lang.strings.onboarding.appUpdateFailed.subtext}
          buttonText={lang.strings.buttons.retry}
          Icon={AppUpdateIcon}
          handleClick={onRetry}
        />
      );
    case appUpdateStates.failedFallback:
      return (
        <AppUpdateFailedFallback
          title={lang.strings.onboarding.appUpdateFailedFallback.heading}
          subtext={lang.strings.onboarding.appUpdateFailedFallback.subtext}
          linkText="download Link"
          alertText={lang.strings.onboarding.appUpdateFailedFallback.alertText}
        />
      );

    default:
      return (
        <UpdateConfirmationDialog
          title={lang.strings.onboarding.appUpdate.title}
          subtext={lang.strings.onboarding.appUpdate.subtext}
          buttonText={lang.strings.buttons.update}
          Icon={AppUpdateIcon}
          handleClick={onConfirm}
        />
      );
  }
};
