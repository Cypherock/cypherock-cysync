import { ManagerApp } from '@cypherock/sdk-app-manager';
import React, { useCallback, useEffect, useMemo } from 'react';
import semver from 'semver';

import { useStateToRef } from '~/hooks';

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
  const { connection: connectionInfo } = useDevice();
  const [version, setVersion] = React.useState<string | undefined>();

  const connectionRef = useStateToRef({ connectionInfo });

  const fetchLatestVersion = useCallback(async () => {
    setVersion(undefined);
    const connection = connectionRef.current.connectionInfo;

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
  }, []);

  useEffect(() => {
    const minutes = 15;
    const checkUpdateInterval = setInterval(
      fetchLatestVersion,
      minutes * 60 * 1000,
    );
    return () => clearInterval(checkUpdateInterval);
  }, [fetchLatestVersion]);

  useEffect(() => {
    fetchLatestVersion();
  }, [connectionInfo]);

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
