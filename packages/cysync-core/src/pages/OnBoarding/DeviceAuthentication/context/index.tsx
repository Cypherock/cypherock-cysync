import { ManagerApp } from '@cypherock/sdk-app-manager';
import React, {
  Context,
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { routes } from '~/constants';
import { DeviceTask, useDeviceTask, useNavigateTo } from '~/hooks';
import { keyValueStore } from '~/utils';

export interface DeviceAuthOnboardingContextInterface {
  task: {
    run: () => Promise<{
      error?: Error | undefined;
      result?: boolean | undefined;
    }>;
    abort: () => Promise<void>;
    error: Error | undefined;
    result: boolean | undefined;
    isRunning: boolean;
  };
  onRetry: () => void;
}
export const DeviceAuthOnboardingContext: Context<DeviceAuthOnboardingContextInterface> =
  createContext<DeviceAuthOnboardingContextInterface>(
    {} as DeviceAuthOnboardingContextInterface,
  );

export const DeviceAuthOnboardingProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const navigateTo = useNavigateTo();

  const deviceAuth: DeviceTask<boolean> = async connection => {
    const app = await ManagerApp.create(connection);
    await app.authDevice({
      email: (await keyValueStore.email.get()) ?? undefined,
      cysyncVersion: window.cysyncEnv.VERSION,
    });
    return true;
  };

  const task = useDeviceTask(deviceAuth);

  const onRetry = () => {
    task.run();
  };

  useEffect(() => {
    if (task.result) {
      navigateTo(
        `${routes.onboarding.joystickTraining.path}?disableNavigation=true`,
        3000,
      );
    }
  }, [task.result]);

  const ctx = useMemo(() => ({ task, onRetry }), [task, onRetry]);

  return (
    <DeviceAuthOnboardingContext.Provider value={ctx}>
      {children}
    </DeviceAuthOnboardingContext.Provider>
  );
};

export function useDeviceAuthOnboarding(): DeviceAuthOnboardingContextInterface {
  return useContext(DeviceAuthOnboardingContext);
}
