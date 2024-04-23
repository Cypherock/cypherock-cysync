import {
  AlertBox,
  ArrowRightIcon,
  Check,
  CloseButton,
  DialogBox,
  DialogBoxBody,
  Divider,
  Flex,
  GenericConfirmDeviceGraphics,
  LangDisplay,
  LeanBox,
  LeanBoxContainer,
  LeanBoxProps,
  Throbber,
  Typography,
} from '@cypherock/cysync-ui';
import { AuthDeviceStatus, ManagerApp } from '@cypherock/sdk-app-manager';
import React, { useEffect, useMemo, useState } from 'react';

import {
  ErrorHandlerDialog,
  WithConnectedDevice,
  DeviceAuthenticating,
} from '~/components';
import { DeviceTask, useDeviceTask } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { keyValueStore } from '~/utils';

import { useAuthenticateX1VaultDialog } from '../context';

const rightArrowIcon = <ArrowRightIcon />;
const checkIcon = <Check width={15} height={12} />;
const throbber = <Throbber size={15} strokeWidth={2} />;

const X1VaultAuthProcess: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose, onNext } = useAuthenticateX1VaultDialog();
  const { dialogs } = lang.strings;
  const { authX1Vault, title } = dialogs.auth;
  const [authDeviceStatus, setAuthDeviceStatus] = useState<AuthDeviceStatus>();

  const deviceAuth: DeviceTask<boolean> = async connection => {
    const app = await ManagerApp.create(connection);
    await app.authDevice({
      email: (await keyValueStore.email.get()) ?? undefined,
      cysyncVersion: window.cysyncEnv.VERSION,
      onEvent: setAuthDeviceStatus,
    });
    return true;
  };

  const task = useDeviceTask(deviceAuth);

  const onRetry = () => {
    task.run();
  };

  const stepsList: LeanBoxProps[] = useMemo<LeanBoxProps[]>(
    () => [
      {
        id: '1',
        text: authX1Vault.steps.confirm,
        leftImage: rightArrowIcon,
        rightImage: task.result ? checkIcon : throbber,
      },
    ],
    [task.result],
  );

  useEffect(() => {
    if (task.result === true) {
      onNext();
    }
  }, [onNext, task.result]);

  const isAuthenticating =
    authDeviceStatus === AuthDeviceStatus.AUTH_DEVICE_STATUS_USER_CONFIRMED &&
    task.result === undefined;

  return (
    <ErrorHandlerDialog
      onClose={onClose}
      onRetry={onRetry}
      error={task.error}
      showCloseButton
    >
      {isAuthenticating ? (
        <DeviceAuthenticating
          title={authX1Vault.authenticating.title}
          subtitle={authX1Vault.authenticating.description}
        />
      ) : (
        <DialogBox width={500} align="stretch" gap={0} onClose={onClose}>
          <Flex direction="row" justify="flex-end" py={2} px={3}>
            <CloseButton onClick={onClose} />
          </Flex>
          <Divider variant="horizontal" />
          <DialogBoxBody gap={0} p={0} m={0} align="stretch">
            <Flex
              pt={4}
              pb={{ def: 2, lg: 4 }}
              px={{ def: 3, lg: 5 }}
              gap={{ def: 16, lg: 32 }}
              direction="column"
              align="center"
            >
              <GenericConfirmDeviceGraphics />
              <Flex direction="column" gap={4} align="center">
                <Typography color="white" $fontSize={20} $textAlign="center">
                  <LangDisplay text={title} />
                </Typography>
                <Typography color="muted" $fontSize={16} $textAlign="center">
                  <LangDisplay text={authX1Vault.description} />
                </Typography>
              </Flex>
            </Flex>
            <Flex
              pt={2}
              pb={{ def: 2, lg: 4 }}
              px={{ def: 3, lg: 5 }}
              gap={8}
              direction="column"
              align="stretch"
            >
              <LeanBoxContainer>
                {stepsList.map(data => (
                  <LeanBox
                    key={data.id}
                    {...data}
                    color="white"
                    disabled={false}
                  />
                ))}
              </LeanBoxContainer>
            </Flex>
            <Flex
              pt={2}
              pb={{ def: 2, lg: 4 }}
              px={{ def: 3, lg: 5 }}
              gap={8}
              direction="column"
              align="stretch"
            >
              <AlertBox subAlert={authX1Vault.info} variant="warning" />
            </Flex>
          </DialogBoxBody>
        </DialogBox>
      )}
    </ErrorHandlerDialog>
  );
};

export const X1VaultAuthProcessWithDevice: React.FC = () => {
  const { onClose } = useAuthenticateX1VaultDialog();
  return (
    <WithConnectedDevice onClose={onClose}>
      <X1VaultAuthProcess />
    </WithConnectedDevice>
  );
};
