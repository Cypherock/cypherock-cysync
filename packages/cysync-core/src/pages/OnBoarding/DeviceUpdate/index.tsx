import {
  LogoOutlinedAsideImage,
  DeviceUpdateIcon,
  SuccessDialog,
  UpdatingDialog,
  FailedDialog,
  UpdateConfirmationDialog,
} from '@cypherock/cysync-ui';
import { WithConnectedDevice } from '~/components';
import { OnboardingPageLayout } from '~/pages/OnBoarding/OnboardingPageLayout';
import React, { FC } from 'react';
import { selectLanguage, useAppSelector } from '~/store';

enum DeviceUpdateStates {
  confirmation,
  updating,
  successful,
  failed,
}

export const DeviceUpdateDialogBox: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const [state, setState] = React.useState(DeviceUpdateStates.confirmation);
  const onRetry = () => {
    setState(DeviceUpdateStates.updating);
  };
  const onUpdate = () => {
    setState(DeviceUpdateStates.failed);
  };

  const onContinue = () => {};

  switch (state) {
    case DeviceUpdateStates.confirmation:
      return (
        <UpdateConfirmationDialog
          title={lang.strings.onboarding.deviceUpdate.title}
          Icon={DeviceUpdateIcon}
          subtext={lang.strings.onboarding.deviceUpdate.subtext}
        />
      );
    case DeviceUpdateStates.updating:
      return (
        <UpdatingDialog
          title={lang.strings.onboarding.deviceUpdating.heading}
          subtext={lang.strings.onboarding.deviceUpdating.subtext}
          Icon={DeviceUpdateIcon}
          handleComplete={onUpdate}
        />
      );
    case DeviceUpdateStates.successful:
      return (
        <SuccessDialog
          title={lang.strings.onboarding.deviceUpdateSuccessful.heading}
          subtext={lang.strings.onboarding.deviceUpdateSuccessful.subtext}
          buttonText={lang.strings.buttons.continue}
          handleClick={onContinue}
        />
      );
    case DeviceUpdateStates.failed:
      return (
        <FailedDialog
          title={lang.strings.onboarding.deviceUpdateFailed.heading}
          subtext={lang.strings.onboarding.deviceUpdateFailed.subtext}
          buttonText={lang.strings.buttons.retry}
          Icon={DeviceUpdateIcon}
          handleClick={onRetry}
        />
      );
    default:
      return (
        <UpdateConfirmationDialog
          title={lang.strings.onboarding.deviceUpdate.title}
          Icon={DeviceUpdateIcon}
          subtext={lang.strings.onboarding.deviceUpdate.subtext}
        />
      );
  }
};

export const DeviceUpdate = () => {
  const lang = useAppSelector(selectLanguage);

  return (
    <OnboardingPageLayout
      img={LogoOutlinedAsideImage}
      text={lang.strings.onboarding.deviceUpdate.heading}
      currentState={3}
      totalState={8}
      withHelp
    >
      <WithConnectedDevice>
        <DeviceUpdateDialogBox />
      </WithConnectedDevice>
    </OnboardingPageLayout>
  );
};
