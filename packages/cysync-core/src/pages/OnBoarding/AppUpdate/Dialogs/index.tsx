import React, { FC } from 'react';
import { selectLanguage, useAppSelector } from '~/store';
import { AppUpdateConfirmation } from './AppUpdateConfirmation';
import { AppUpdating } from './AppUpdating';
import { AppUpdateSuccessful } from './AppUpdateSuccessful';

enum appUpdateStates {
  confirmation,
  updating,
  successful,
}

interface AppUpdateDialogBoxProps {
  setBack: (back: boolean) => void;
}

export const AppUpdateDialogBox: FC<AppUpdateDialogBoxProps> = ({
  setBack,
}) => {
  const lang = useAppSelector(selectLanguage);
  const [state, setState] = React.useState(appUpdateStates.successful);

  const onConfirm = () => {
    setBack(false);
    setState(appUpdateStates.updating);
  };

  const onUpdate = () => {
    setState(appUpdateStates.successful);
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
