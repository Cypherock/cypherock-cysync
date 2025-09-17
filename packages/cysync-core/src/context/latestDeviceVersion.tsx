import { FirmwareVariant, ManagerApp } from '@cypherock/sdk-app-manager';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import semver from 'semver';

import { useStateToRef } from '~/hooks';
import logger from '~/utils/logger';

import {
  DeviceConnectionStatus,
  getFirmwareVariantDisplayName,
  selectLastConnectedFirmware,
  useAppSelector,
  useDevice,
} from '..';

export interface LatestDeviceVersionContextInterface {
  version: string | undefined;
  variantDisplayName: string;
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
  const requestIdRef = useRef<number>(0);

  const connectionRef = useStateToRef({ connectionInfo });

  const { isFirmwareBtcOnly } = useAppSelector(selectLastConnectedFirmware);
  const variant = isFirmwareBtcOnly
    ? FirmwareVariant.BTC_ONLY
    : FirmwareVariant.MULTI_COIN;

  const variantDisplayName = getFirmwareVariantDisplayName(variant);

  const fetchLatestVersion = useCallback(async () => {
    const currentRequestId = requestIdRef.current + 1;
    setVersion(undefined);
    const connection = connectionRef.current.connectionInfo;

    if (
      !connection ||
      connection.status !== DeviceConnectionStatus.CONNECTED ||
      connection.isBootloader
    ) {
      return;
    }

    const result = await ManagerApp.getLatestFirmware({
      prerelease: window.cysyncEnv.ALLOW_PRERELEASE === 'true',
      variant,
    });

    if (currentRequestId !== requestIdRef.current) {
      logger.info('Request is outdated, ignoring result', {
        currentRequestId,
        latestRequestId: requestIdRef.current,
      });
      return;
    }

    if (
      connection.firmwareVersion &&
      semver.gte(connection.firmwareVersion, result.version)
    ) {
      return;
    }

    setVersion(result.version);
  }, [variant]);

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
  }, [connectionInfo, variant]);

  const ctx = useMemo(
    () => ({
      version,
      variantDisplayName,
    }),
    [version, variantDisplayName],
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
