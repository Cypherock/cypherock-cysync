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
}

const isValidConnectedDevice = (
  connection: IDeviceConnectionInfo | undefined,
  props: Omit<WithConnectedDeviceProps, 'children'>,
) => {
  if (!connection) return false;

  if (connection.status !== DeviceConnectionStatus.CONNECTED) return false;

  if (props.onInitial && connection.isInitial) {
    return true;
  }

  return false;
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
};
