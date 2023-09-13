import { OnboardingStep } from '@cypherock/sdk-app-manager';
import React, { useEffect } from 'react';

import {
  openAppUpdateDialog,
  openDeviceAuthenticationDialog,
  openDeviceUpdateDialog,
} from '~/actions';
import { routes } from '~/constants';
import { DeviceConnectionStatus, useDevice } from '~/context';
import { useNavigateTo } from '~/hooks';
import { useAppDispatch } from '~/store';
import { keyValueStore } from '~/utils';

const OnboardingMap: Record<OnboardingStep, string> = {
  [OnboardingStep.ONBOARDING_STEP_VIRGIN_DEVICE]: routes.onboarding.info.path,
  [OnboardingStep.ONBOARDING_STEP_DEVICE_AUTH]:
    routes.onboarding.joystickTraining.path,
  [OnboardingStep.ONBOARDING_STEP_JOYSTICK_TRAINING]:
    routes.onboarding.cardTraining.path,
  [OnboardingStep.ONBOARDING_STEP_CARD_CHECKUP]:
    routes.onboarding.cardTraining.path,
  [OnboardingStep.ONBOARDING_STEP_CARD_AUTHENTICATION]:
    routes.onboarding.congratulations.path,
  [OnboardingStep.ONBOARDING_STEP_COMPLETE]:
    routes.onboarding.congratulations.path,
  [OnboardingStep.UNRECOGNIZED]: routes.onboarding.info.path,
};

export const DeviceHandlingTask: React.FC = () => {
  const { connection } = useDevice();
  const dispatch = useAppDispatch();
  const navigateTo = useNavigateTo();

  const startDeviceUpdate = () => {
    dispatch(openDeviceUpdateDialog());
  };
  const startDeviceAuthentication = () => {
    dispatch(openDeviceAuthenticationDialog());
  };

  const startAppUpdate = () => {
    dispatch(openAppUpdateDialog());
  };

  const onConnectionChange = async () => {
    if (!connection || !(await keyValueStore.isOnboardingCompleted.get())) {
      return;
    }

    if (connection.status === DeviceConnectionStatus.INCOMPATIBLE) {
      startAppUpdate();
    } else if (
      connection.status === DeviceConnectionStatus.CONNECTED &&
      connection.isBootloader
    ) {
      startDeviceUpdate();
    } else if (
      connection.status === DeviceConnectionStatus.CONNECTED &&
      (connection.onboardingStep !== OnboardingStep.ONBOARDING_STEP_COMPLETE ||
        connection.isInitial)
    ) {
      await keyValueStore.isOnboardingCompleted.set(false);
      navigateTo(OnboardingMap[connection.onboardingStep]);
    } else if (
      connection.status === DeviceConnectionStatus.CONNECTED &&
      connection.isMain &&
      !connection.isAuthenticated
    ) {
      startDeviceAuthentication();
    }
  };

  useEffect(() => {
    onConnectionChange();
  }, [connection]);

  return null;
};
