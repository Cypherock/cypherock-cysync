import { OnboardingStep } from '@cypherock/sdk-app-manager';
import { useEffect, useState } from 'react';

import { keyValueStore } from '~/utils';

import { DeviceConnectionStatus, useDevice } from '..';

export enum DeviceHandlingState {
  NOT_CONNECTED,
  INCOMPATIBLE,
  BOOTLOADER,
  NOT_ONBOARDED,
  NOT_AUTHENTICATED,
  USABLE,
  UNKNOWN_ERROR,
}

export const fetchDeviceHandlingState = () => {
  const [deviceHandlingState, setDeviceHandlingState] = useState(
    DeviceHandlingState.NOT_CONNECTED,
  );
  const { connection } = useDevice();

  const onConnectionChange = async () => {
    setDeviceHandlingState(DeviceHandlingState.NOT_CONNECTED);
    // Only works if app has completed onboarding
    if (!connection || !(await keyValueStore.isOnboardingCompleted.get()))
      return;

    if (connection.status === DeviceConnectionStatus.INCOMPATIBLE) {
      setDeviceHandlingState(DeviceHandlingState.INCOMPATIBLE);
    } else if (
      connection.status === DeviceConnectionStatus.CONNECTED &&
      connection.isBootloader
    ) {
      setDeviceHandlingState(DeviceHandlingState.BOOTLOADER);
    } else if (
      connection.status === DeviceConnectionStatus.CONNECTED &&
      (connection.onboardingStep !== OnboardingStep.ONBOARDING_STEP_COMPLETE ||
        connection.isInitial)
    ) {
      setDeviceHandlingState(DeviceHandlingState.NOT_ONBOARDED);
    } else if (
      connection.status === DeviceConnectionStatus.CONNECTED &&
      connection.isMain &&
      !connection.isAuthenticated
    ) {
      setDeviceHandlingState(DeviceHandlingState.NOT_AUTHENTICATED);
    } else if (connection.status === DeviceConnectionStatus.CONNECTED) {
      setDeviceHandlingState(DeviceHandlingState.USABLE);
    } else {
      setDeviceHandlingState(DeviceHandlingState.UNKNOWN_ERROR);
    }
  };

  useEffect(() => {
    onConnectionChange();
  }, [connection]);

  return { deviceHandlingState, connection };
};
