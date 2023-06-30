import {
  DialogBox,
  DialogBoxBody,
  Typography,
  LangDisplay,
  Image,
  disconnectedIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

import {
  DeviceConnectionStatus,
  IDeviceConnectionInfo,
  useDevice,
} from '~/context';
import { useAppSelector, selectLanguage } from '~/store';

export interface WithConnectedDeviceProps {
  children: React.ReactNode;
  onInitial?: boolean;
  allowIncompatible?: boolean;
  allowBootloader?: boolean;
}

const isValidConnectedDevice = (
  connection: IDeviceConnectionInfo | undefined,
  props: Omit<WithConnectedDeviceProps, 'children'>,
) => {
  if (!connection) return false;

  if (
    props.allowIncompatible &&
    connection.status === DeviceConnectionStatus.INCOMPATIBLE
  )
    return true;

  if (
    props.allowBootloader &&
    connection.status === DeviceConnectionStatus.CONNECTED &&
    connection.isBootloader
  )
    return true;

  if (connection.status !== DeviceConnectionStatus.CONNECTED) return false;

  if (props.onInitial) {
    return connection.isInitial;
  }

  if (connection.isBootloader) return false;

  return true;
};

export const WithConnectedDevice: React.FC<WithConnectedDeviceProps> = ({
  children,
  ...props
}) => {
  const lang = useAppSelector(selectLanguage);
  const { connection } = useDevice();

  if (isValidConnectedDevice(connection, props)) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return (
    <DialogBox width={500}>
      <DialogBoxBody pb={8}>
        <Image src={disconnectedIcon} alt="Device not connected" />
        <Typography variant="h5" $textAlign="center">
          <LangDisplay text={lang.strings.onboarding.deviceDetection.title} />
        </Typography>
      </DialogBoxBody>
    </DialogBox>
  );
};

WithConnectedDevice.defaultProps = {
  onInitial: false,
  allowIncompatible: false,
  allowBootloader: false,
};
