import {
  AlertBox,
  ArrowRightIcon,
  Check,
  CloseButton,
  DialogBox,
  DialogBoxBody,
  Divider,
  Flex,
  LangDisplay,
  LeanBox,
  LeanBoxContainer,
  LeanBoxProps,
  ScrollableContainer,
  Throbber,
  Typography,
  Video,
  tapAnyCardDeviceAnimation2DVideo,
} from '@cypherock/cysync-ui';
import { AuthCardStatus, ManagerApp } from '@cypherock/sdk-app-manager';
import React, { useEffect, useMemo, useState } from 'react';

import { ErrorHandlerDialog, WithConnectedDevice } from '~/components';
import { DeviceTask, useDeviceTask } from '~/hooks';
import { selectLanguage, useAppSelector } from '~/store';
import { keyValueStore } from '~/utils';

import { useAuthenticateX1CardDialog } from '../context';

const rightArrowIcon = <ArrowRightIcon />;
const checkIcon = <Check width={15} height={12} />;
const throbber = <Throbber size={15} strokeWidth={2} />;

const X1CardAuthProcess: React.FC = () => {
  const lang = useAppSelector(selectLanguage);
  const { onClose, onNext } = useAuthenticateX1CardDialog();
  const { dialogs } = lang.strings;
  const { authX1Card, title } = dialogs.auth;

  const [authCardStatus, setAuthCardStatus] = useState<AuthCardStatus>(
    AuthCardStatus.AUTH_CARD_STATUS_INIT,
  );

  const cardAuth: DeviceTask<boolean> = async connection => {
    const app = await ManagerApp.create(connection);
    await app.authCard({
      isPairRequired: false,
      onEvent: setAuthCardStatus,
      email: (await keyValueStore.email.get()) ?? undefined,
      onlyFailure: false,
      cysyncVersion: window.cysyncEnv.VERSION,
    });
    return true;
  };

  const task = useDeviceTask(cardAuth);

  const onRetry = () => {
    task.run();
  };

  const stepsList: LeanBoxProps[] = useMemo<LeanBoxProps[]>(() => {
    let rightImage1;
    let rightImage2;

    if (authCardStatus === AuthCardStatus.AUTH_CARD_STATUS_INIT) {
      rightImage1 = throbber;
      rightImage2 = undefined;
    } else {
      rightImage1 = checkIcon;
      rightImage2 = task.result ? checkIcon : throbber;
    }

    return [
      {
        id: '1',
        text: authX1Card.steps.confirm,
        leftImage: rightArrowIcon,
        rightImage: rightImage1,
      },
      {
        id: '2',
        text: authX1Card.steps.tapCard,
        leftImage: rightArrowIcon,
        rightImage: rightImage2,
      },
    ];
  }, [authCardStatus, task.result]);

  useEffect(() => {
    if (task.result === true) {
      onNext();
    }
  }, [onNext, task.result]);

  return (
    <ErrorHandlerDialog
      onClose={onClose}
      onRetry={onRetry}
      error={task.error}
      showCloseButton
    >
      <DialogBox
        width={500}
        align="stretch"
        gap={0}
        $maxHeight="90vh"
        onClose={onClose}
      >
        <Flex direction="row" justify="flex-end" py={2} px={3}>
          <CloseButton onClick={onClose} />
        </Flex>
        <Divider variant="horizontal" />
        <ScrollableContainer>
          <DialogBoxBody gap={0} p={0} m={0} align="stretch">
            <Flex
              pt={4}
              pb={{ def: 2, lg: 4 }}
              px={{ def: 3, lg: 5 }}
              gap={{ def: 16, lg: 32 }}
              direction="column"
              align="center"
            >
              <Video
                src={tapAnyCardDeviceAnimation2DVideo}
                autoPlay
                loop
                $width="full"
                $aspectRatio="16/9"
              />
              <Flex direction="column" gap={4} align="center">
                <Typography color="white" $fontSize={20} $textAlign="center">
                  <LangDisplay text={title} />
                </Typography>
                <Typography color="muted" $fontSize={16} $textAlign="center">
                  <LangDisplay text={authX1Card.description} />
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
              <AlertBox subAlert={authX1Card.info} variant="warning" />
            </Flex>
          </DialogBoxBody>
        </ScrollableContainer>
      </DialogBox>
    </ErrorHandlerDialog>
  );
};

export const X1CardAuthProcessWithDevice: React.FC = () => {
  const { onClose } = useAuthenticateX1CardDialog();
  return (
    <WithConnectedDevice onClose={onClose}>
      <X1CardAuthProcess />
    </WithConnectedDevice>
  );
};
