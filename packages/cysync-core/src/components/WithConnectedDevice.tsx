import {
  DialogBox,
  DialogBoxBody,
  Typography,
  LangDisplay,
  Image,
  disconnectedIcon,
  Flex,
} from '@cypherock/cysync-ui';
import { OnboardingStep } from '@cypherock/sdk-app-manager';
import React, { useEffect } from 'react';

import {
  DeviceConnectionStatus,
  IDeviceConnectionInfo,
  useDevice,
} from '~/context';
import { useNavigateTo } from '~/hooks';
import { useAppSelector, selectLanguage } from '~/store';

import { routes } from '../constants';

export interface WithConnectedDeviceProps {
  children?: React.ReactNode;
  onInitial?: boolean;
  allowIncompatible?: boolean;
  allowBootloader?: boolean;
}

const OnboardingMap: Record<OnboardingStep, string> = {
  [OnboardingStep.ONBOARDING_STEP_VIRGIN_DEVICE]:
    routes.onboarding.deviceAuthentication.path,
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
  [OnboardingStep.UNRECOGNIZED]: routes.onboarding.deviceAuthentication.path,
};
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
  const navigateTo = useNavigateTo();

  useEffect(() => {
    if (!props.onInitial) return;
    if (connection?.status === DeviceConnectionStatus.INCOMPATIBLE) {
      navigateTo(routes.onboarding.appUpdate.path);
    } else if (
      connection?.status === DeviceConnectionStatus.CONNECTED &&
      connection.isBootloader
    ) {
      navigateTo(routes.onboarding.deviceUpdate.path);
    } else if (connection?.status === DeviceConnectionStatus.CONNECTED) {
      const step = connection.onboardingStep;
      navigateTo(OnboardingMap[step]);
    }
  }, [connection]);

  if (isValidConnectedDevice(connection, props)) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }

  return (
    <DialogBox width={500}>
      <DialogBoxBody pb={8}>
        <Image src={disconnectedIcon} alt="Device not connected" />
        <Flex direction="column" gap={4}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay text={lang.strings.onboarding.deviceDetection.title} />
          </Typography>
          <Typography variant="h6" $textAlign="center" color="muted">
            <LangDisplay
              text={lang.strings.onboarding.deviceDetection.subtext}
            />
          </Typography>
        </Flex>
      </DialogBoxBody>
    </DialogBox>
  );
};

WithConnectedDevice.defaultProps = {
  children: undefined,
  onInitial: false,
  allowIncompatible: false,
  allowBootloader: false,
};
