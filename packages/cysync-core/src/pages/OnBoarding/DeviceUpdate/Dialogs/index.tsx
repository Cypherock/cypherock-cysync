import React, { FC, ReactElement } from 'react';
import { selectLanguage, useAppSelector } from '~/store';
import {
  ConfirmationDialog,
  DeviceUpdateIcon,
  ErrorDialog,
  ProgressDialog,
  SuccessDialog,
} from '@cypherock/cysync-ui';
import { useNavigateTo } from '~/hooks';
import { routes } from '~/constants';
import { DeviceUpdateLoading } from '~/pages/OnBoarding/DeviceUpdate/Dialogs/DeviceUpdateLoading';

enum DeviceUpdateStates {
  Confirmation,
  Updating,
  Successful,
  Failed,
  Loading,
}

export const DeviceUpdateDialogBox: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const [state, setState] = React.useState(DeviceUpdateStates.Confirmation);
  const navigateTo = useNavigateTo();
  const onRetry = () => {
    setState(DeviceUpdateStates.Updating);
  };
  const onUpdate = () => {
    setState(DeviceUpdateStates.Successful);
  };

  const onContinue = () => {
    navigateTo(`${routes.onboarding.deviceAuthentication.path}`);
  };

  const DeviceUpdateDialogs: Record<DeviceUpdateStates, ReactElement> = {
    [DeviceUpdateStates.Confirmation]: (
      <ConfirmationDialog
        title={lang.strings.onboarding.deviceUpdate.dialogs.confirmation.title}
        icon={<DeviceUpdateIcon />}
        subtext={
          lang.strings.onboarding.deviceUpdate.dialogs.confirmation.subtext
        }
      />
    ),
    [DeviceUpdateStates.Loading]: <DeviceUpdateLoading />,
    [DeviceUpdateStates.Updating]: (
      <ProgressDialog
        title={lang.strings.onboarding.deviceUpdate.dialogs.updating.heading}
        subtext={lang.strings.onboarding.deviceUpdate.dialogs.updating.subtext}
        icon={<DeviceUpdateIcon />}
        handleComplete={onUpdate}
      />
    ),
    [DeviceUpdateStates.Successful]: (
      <SuccessDialog
        title={
          lang.strings.onboarding.deviceUpdate.dialogs.updateSuccessful.heading
        }
        subtext={
          lang.strings.onboarding.deviceUpdate.dialogs.updateSuccessful.subtext
        }
        buttonText={lang.strings.buttons.continue}
        handleClick={onContinue}
      />
    ),
    [DeviceUpdateStates.Failed]: (
      <ErrorDialog
        title={
          lang.strings.onboarding.deviceUpdate.dialogs.updateFailed.heading
        }
        subtext={
          lang.strings.onboarding.deviceUpdate.dialogs.updateFailed.subtext
        }
        onRetry={onRetry}
        showRetry
      />
    ),
  };

  return DeviceUpdateDialogs[state];
};
