import {
  DialogBox,
  DialogBoxBody,
  Typography,
  LangDisplay,
  Image,
  disconnectedIcon,
} from '@cypherock/cysync-ui';
import React from 'react';

import { DeviceConnectionStatus, useDevice } from '~/context';
import { useAppSelector, selectLanguage } from '~/store';

export interface WithConnectedDeviceProps {
  children: React.ReactNode;
}

export const WithConnectedDevice: React.FC<WithConnectedDeviceProps> = ({
  children,
}) => {
  const lang = useAppSelector(selectLanguage);
  const { connection } = useDevice();

  if (
    connection?.status === DeviceConnectionStatus.CONNECTED &&
    connection.isInitial
  ) {
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
