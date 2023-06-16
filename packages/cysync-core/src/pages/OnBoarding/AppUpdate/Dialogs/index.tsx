import React, { FC } from 'react';
import { selectLanguage, useAppSelector } from '~/store';
import { AppUpdateFailed } from '~/pages/OnBoarding/AppUpdate/Dialogs/AppUpdateFailed';
import { AppUpdateFailedFallback } from '~/pages/OnBoarding/AppUpdate/Dialogs/AppUpdateFailedFallback';
import { AppUpdateConfirmation } from './AppUpdateConfirmation';
import { AppUpdating } from './AppUpdating';
import { AppUpdateSuccessful } from './AppUpdateSuccessful';

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
  const [state, setState] = React.useState(appUpdateStates.failedFallback);
  const [tries, setTries] = React.useState(0);
  const onConfirm = () => {
    setBack(false);
    setState(appUpdateStates.updating);
  };

  const onUpdate = () => {
    setState(appUpdateStates.failed);
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
        <AppUpdateConfirmation
          title={lang.strings.onboarding.appUpdate.title}
          buttonText={lang.strings.onboarding.appUpdate.buttons.update}
          handleClick={onConfirm}
        />
      );
    case appUpdateStates.updating:
      return (
        <AppUpdating
          title={lang.strings.onboarding.appUpdating.heading}
          subtext={lang.strings.onboarding.appUpdating.subtext}
          handleComplete={onUpdate}
        />
      );
    case appUpdateStates.successful:
      return (
        <AppUpdateSuccessful
          title={lang.strings.onboarding.appUpdateSuccessful.heading}
          subtext={lang.strings.onboarding.appUpdateSuccessful.subtext}
          infoText={lang.strings.onboarding.appUpdateSuccessful.bubbleText}
        />
      );
    case appUpdateStates.failed:
      return (
        <AppUpdateFailed
          title={lang.strings.onboarding.appUpdateFailed.heading}
          buttonText={lang.strings.buttons.retry}
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
        <AppUpdateConfirmation
          title={lang.strings.onboarding.appUpdate.title}
          buttonText={lang.strings.onboarding.appUpdate.buttons.update}
          handleClick={onConfirm}
        />
      );
  }
};
