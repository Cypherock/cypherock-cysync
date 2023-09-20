import { ManagerApp } from '@cypherock/sdk-app-manager';
import React, { useEffect, useMemo } from 'react';
import semver from 'semver';

import { DeviceConnectionStatus, useDevice } from '..';

export interface LatestDeviceVersionContextInterface {
  version: string | undefined;
}

export const LatestDeviceVersionContext: React.Context<LatestDeviceVersionContextInterface> =
  React.createContext<LatestDeviceVersionContextInterface>(
    {} as LatestDeviceVersionContextInterface,
  );

export interface LatestDeviceVersionProviderProps {
  children: React.ReactNode;
}

export const LatestDeviceVersionProvider: React.FC<
  LatestDeviceVersionProviderProps
> = ({ children }) => {
  const { connection } = useDevice();
  const [version, setVersion] = React.useState<string | undefined>();

  const fetchLatestVersion = async () => {
    setVersion(undefined);
    if (
      !connection ||
      connection.status !== DeviceConnectionStatus.CONNECTED ||
      connection.isBootloader
    )
      return;

    const result = await ManagerApp.getLatestFirmware({
      prerelease: window.cysyncEnv.ALLOW_PRERELEASE === 'true',
    });

    if (
      connection.firmwareVersion &&
      semver.gte(connection.firmwareVersion, result.version)
    )
      return;

    setVersion(result.version);
  };

  useEffect(() => {
    fetchLatestVersion();
  }, [connection]);

  const ctx = useMemo(
    () => ({
      version,
    }),
    [version],
  );

  return (
    <LatestDeviceVersionContext.Provider value={ctx}>
      {children}
    </LatestDeviceVersionContext.Provider>
  );
};

export function useLatestDeviceVersion(): LatestDeviceVersionContextInterface {
  return React.useContext(LatestDeviceVersionContext);
}
