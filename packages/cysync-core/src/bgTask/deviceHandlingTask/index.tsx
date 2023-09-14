import { OnboardingStep } from '@cypherock/sdk-app-manager';
import {
  DeviceCommunicationError,
  DeviceCommunicationErrorType,
} from '@cypherock/sdk-interfaces';
import React, { useEffect } from 'react';

import {
  openAppUpdateDialog,
  openDeviceAuthenticationDialog,
  openDeviceUpdateDialog,
  openErrorDialog,
} from '~/actions';
import { routes } from '~/constants';
import {
  DeviceHandlingState,
  fetchDeviceHandlingState,
  useNavigateTo,
} from '~/hooks';
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
  const { deviceHandlingState, connection } = fetchDeviceHandlingState();
  const dispatch = useAppDispatch();
  const navigateTo = useNavigateTo();

  const handlingStateToActionMap: Partial<
    Record<DeviceHandlingState, () => Promise<void>>
  > = {
    [DeviceHandlingState.INCOMPATIBLE]: async () => {
      dispatch(openAppUpdateDialog());
    },
    [DeviceHandlingState.BOOTLOADER]: async () => {
      dispatch(openDeviceUpdateDialog());
    },
    [DeviceHandlingState.NOT_ONBOARDED]: async () => {
      await keyValueStore.isOnboardingCompleted.set(false);
      navigateTo(
        OnboardingMap[
          connection?.onboardingStep ?? OnboardingStep.UNRECOGNIZED
        ],
      );
    },
    [DeviceHandlingState.NOT_AUTHENTICATED]: async () => {
      dispatch(openDeviceAuthenticationDialog());
    },
    [DeviceHandlingState.UNKNOWN_ERROR]: async () => {
      const error = new DeviceCommunicationError(
        DeviceCommunicationErrorType.UNKNOWN_COMMUNICATION_ERROR,
      );
      dispatch(
        openErrorDialog({
          error,
          showCloseButton: true,
          suppressActions: true,
        }),
      );
    },
  };

  const onStateChange = async () => {
    const action = handlingStateToActionMap[deviceHandlingState];
    if (action) await action();
  };

  useEffect(() => {
    onStateChange();
  }, [deviceHandlingState]);

  return null;
};
