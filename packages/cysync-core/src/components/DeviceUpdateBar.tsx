import {
  LangDisplay,
  UpdateBar,
  Container,
  FirmwareIcon,
} from '@cypherock/cysync-ui';
import { ManagerApp } from '@cypherock/sdk-app-manager';
import React, { FC, useEffect } from 'react';
import semver from 'semver';
import { useTheme } from 'styled-components';

import { openDeviceUpdateDialog } from '~/actions';

import {
  DeviceConnectionStatus,
  selectLanguage,
  useAppDispatch,
  useAppSelector,
  useDevice,
} from '..';

export const DeviceUpdateBar: FC = () => {
  const theme = useTheme();
  const lang = useAppSelector(selectLanguage);
  const { connection } = useDevice();
  const dispatch = useAppDispatch();
  const [version, setVersion] = React.useState<string | undefined>();

  const fetchNewVersion = async () => {
    setVersion(undefined);
    if (
      !connection ||
      connection.status !== DeviceConnectionStatus.CONNECTED ||
      !connection.isMain ||
      !connection.isAuthenticated
    ) {
      return;
    }

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
    fetchNewVersion();
  }, [connection]);

  if (!version) {
    return null;
  }

  return (
    <Container px={2} pt={2} pb={1} $bgColor="contentGradient" width="full">
      <UpdateBar
        icon={
          <FirmwareIcon
            width={21}
            height={18}
            fill={theme?.palette.text.heading}
            stroke={theme?.palette.text.heading}
          />
        }
        onButtonClick={() => {
          dispatch(openDeviceUpdateDialog());
        }}
        text={
          <LangDisplay
            text={lang.strings.deviceUpdateBar.message}
            variables={{ version }}
          />
        }
        buttonText={lang.strings.deviceUpdateBar.button}
      />
    </Container>
  );
};
