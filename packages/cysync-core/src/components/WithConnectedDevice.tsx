import {
  Button,
  CloseButton,
  DialogBox,
  DialogBoxBody,
  DialogBoxFooter,
  Divider,
  Flex,
  Image,
  LangDisplay,
  Typography,
  Video,
  deviceConnectionAnimation2DVideo,
  disconnectedIcon,
} from '@cypherock/cysync-ui';
import { OnboardingStep } from '@cypherock/sdk-app-manager';
import React, { useEffect } from 'react';
import { Location, useLocation } from 'react-router-dom';

import {
  DeviceConnectionStatus,
  DeviceHandlingState,
  IDeviceConnectionInfo,
  useDevice,
} from '~/context';
import { useNavigateTo, useQuery } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';

import { routes } from '../constants';

export interface WithConnectedDeviceProps {
  children?: React.ReactNode;
  onInitial?: boolean;
  allowIncompatible?: boolean;
  allowBootloader?: boolean;
  disableNavigation?: boolean;
  buttonLabel?: string;
  showAnimation?: boolean;
  buttonOnClick?: () => void;
  onClose?: () => void;
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

const getRedirectionPath = (
  connection: IDeviceConnectionInfo | undefined,
  location: Location,
  query: URLSearchParams,
  props: Omit<WithConnectedDeviceProps, 'children'>,
) => {
  const result: { path: string | undefined; doRender: boolean } = {
    path: undefined,
    doRender: true,
  };

  if (!props.onInitial || props.disableNavigation) {
    return result;
  }

  if (!connection && query.get('disableNavigation') === 'true') {
    // Remove query param when device is removed
    result.path = location.pathname;
  } else if (connection?.status === DeviceConnectionStatus.INCOMPATIBLE) {
    result.path = routes.onboarding.appUpdate.path;
    result.doRender = false;
  } else if (
    connection?.status === DeviceConnectionStatus.CONNECTED &&
    connection.isBootloader
  ) {
    result.path = `${routes.onboarding.deviceUpdate.path}?disableNavigation=true`;
    result.doRender = false;
  } else if (
    connection?.status === DeviceConnectionStatus.CONNECTED &&
    query.get('disableNavigation') !== 'true'
  ) {
    const step = connection.onboardingStep;
    const route = OnboardingMap[step];
    result.path = `${route}?disableNavigation=true`;
    if (route === routes.onboarding.congratulations.path) {
      result.path += '&noUI=true';
    }
    result.doRender = false;
  }

  return result;
};

export const WithConnectedDevice: React.FC<WithConnectedDeviceProps> = ({
  children,
  showAnimation = true,
  onClose,
  ...props
}) => {
  const lang = useAppSelector(selectLanguage);

  const { deviceHandlingState, connection } = useDevice();
  const navigateTo = useNavigateTo();
  const location = useLocation();
  const query = useQuery();

  const [showChildren, setShowChildren] = React.useState(false);
  const [deviceUnavailable, setDeviceUnavailable] = React.useState(false);

  useEffect(() => {
    setDeviceUnavailable(
      deviceHandlingState === DeviceHandlingState.INCOMPATIBLE ||
        deviceHandlingState === DeviceHandlingState.NOT_AUTHENTICATED ||
        deviceHandlingState === DeviceHandlingState.UNKNOWN_ERROR,
    );
  }, [deviceHandlingState]);

  useEffect(() => {
    const { path, doRender } = getRedirectionPath(
      connection,
      location,
      query,
      props,
    );

    if (path) navigateTo(path);

    setShowChildren(doRender && isValidConnectedDevice(connection, props));
  }, [
    connection,
    location,
    query,
    props.onInitial,
    props.allowBootloader,
    props.allowIncompatible,
    props.disableNavigation,
  ]);

  if (showChildren) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{children}</>;
  }
  const showFooter =
    !deviceUnavailable && props.buttonLabel && props.buttonOnClick;
  return (
    <DialogBox width={500} align="stretch" onClose={onClose}>
      {onClose && (
        <>
          <Flex direction="row" justify="flex-end" py={2} px={3}>
            <CloseButton onClick={onClose} />
          </Flex>
          <Divider variant="horizontal" />
        </>
      )}
      <DialogBoxBody pb={showFooter ? 4 : 8}>
        {showAnimation ? (
          <Video
            src={deviceConnectionAnimation2DVideo}
            autoPlay
            loop
            $width="full"
            $aspectRatio="16/9"
          />
        ) : (
          <Image src={disconnectedIcon} alt="Device not connected" />
        )}
        <Flex direction="column" gap={4}>
          <Typography variant="h5" $textAlign="center">
            <LangDisplay
              text={
                deviceUnavailable
                  ? lang.strings.onboarding.deviceDetection.unavailable.title
                  : lang.strings.onboarding.deviceDetection.title
              }
            />
          </Typography>
          <Typography variant="h6" $textAlign="center" color="muted">
            <LangDisplay
              text={
                deviceUnavailable
                  ? lang.strings.onboarding.deviceDetection.unavailable.subtext
                  : ''
              }
            />
          </Typography>
        </Flex>
      </DialogBoxBody>
      {showFooter && (
        <DialogBoxFooter>
          <Button variant="secondary" onClick={props.buttonOnClick}>
            {props.buttonLabel}
          </Button>
        </DialogBoxFooter>
      )}
    </DialogBox>
  );
};

WithConnectedDevice.defaultProps = {
  children: undefined,
  onInitial: false,
  allowIncompatible: false,
  allowBootloader: false,
  disableNavigation: false,
  buttonLabel: undefined,
  buttonOnClick: undefined,
  showAnimation: true,
  onClose: undefined,
};
