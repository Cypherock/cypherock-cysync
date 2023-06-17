import {
  LogoOutlinedAsideImage,
  DeviceUpdateIcon,
  SuccessDialog,
  ProgressDialog,
  ErrorDialog,
  ConfirmationDialog,
  useTheme,
} from '@cypherock/cysync-ui';
import { WithConnectedDevice } from '~/components';
import { OnboardingPageLayout } from '~/pages/OnBoarding/OnboardingPageLayout';
import React, { FC, ReactElement } from 'react';
import { selectLanguage, useAppSelector } from '~/store';
import { useNavigateTo } from '~/hooks';
import { routes } from '~/constants';

enum DeviceUpdateStates {
  Confirmation,
  Updating,
  Successful,
  Failed,
}

export const DeviceUpdateDialogBox: FC = () => {
  const lang = useAppSelector(selectLanguage);
  const [state, setState] = React.useState(DeviceUpdateStates.Confirmation);
  const theme = useTheme();
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
        icon={<DeviceUpdateIcon color={theme.palette.warn.main} />}
        onRetry={onRetry}
        showRetry
      />
    ),
  };

  return DeviceUpdateDialogs[state];
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
