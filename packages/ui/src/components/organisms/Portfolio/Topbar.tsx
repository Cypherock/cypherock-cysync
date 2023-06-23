import React, { FC } from 'react';
import { Container, Flex, Image, LangDisplay, Typography } from '../../atoms';
import {
  checkIcon,
  connected,
  hide,
  lock,
  lockOpen,
  noNotifications,
  notifications,
  redDisconnectedIcon,
  show,
  syncProblem,
  syncronizing,
} from '../../../assets';

const connectionStatesMap = {
  connected: {
    src: connected,
  },
  connectionError: {
    src: redDisconnectedIcon,
  },
  disconnected: {
    src: redDisconnectedIcon,
  },
};

const syncStatesMap = {
  syncronized: {
    src: checkIcon,
  },
  syncronizing: {
    src: syncronizing,
  },
  syncError: {
    src: syncProblem,
  },
};

export const Topbar: FC<{
  title: string;
  statuses: {
    syncronized: string;
    connected: string;
    syncronizing: string;
    syncError: string;
    disconnected: string;
    connectionError: string;
  };
  isVisible: boolean;
  isLock: boolean;
  haveNotifications: boolean;
  syncState: 'syncronized' | 'syncronizing' | 'syncError';
  connectionState: 'connected' | 'connectionError' | 'disconnected';
}> = ({
  title,
  statuses,
  connectionState,
  haveNotifications,
  isLock,
  isVisible,
  syncState,
}) => (
  <Container
    p={3}
    $bgColor="contentGradient"
    width="full"
    justify="space-between"
  >
    <Typography variant="h4" $fontWeight="semibold" color="silver">
      <LangDisplay text={title} />
    </Typography>
    <Flex align="center">
      <Flex pr={2} $borderR={1} align="center" gap={16}>
        <Image src={syncStatesMap[syncState].src} alt="syncState" />
        <Typography color="muted">
          <LangDisplay text={statuses[syncState]} />
        </Typography>
      </Flex>
      <Flex
        px={2}
        $borderR={1}
        $borderVariant="separator"
        align="center"
        gap={16}
      >
        <Image
          src={connectionStatesMap[connectionState].src}
          alt="connectionState"
        />
        <Typography color="muted">
          <LangDisplay text={statuses[connectionState]} />
        </Typography>
      </Flex>
      <Flex
        px={2}
        py="3"
        height="full"
        $borderR={1}
        $borderVariant="separator"
        align="center"
        gap={16}
      >
        <Image
          src={haveNotifications ? notifications : noNotifications}
          alt="notifications"
        />
      </Flex>
      <Flex
        px={2}
        py="3"
        $borderR={1}
        $borderVariant="separator"
        align="center"
        gap={16}
      >
        <Image src={isVisible ? show : hide} alt="visiblity" />
      </Flex>
      <Flex px={2} py="3" align="center" gap={16}>
        <Image src={isLock ? lock : lockOpen} alt="lock" />
      </Flex>
    </Flex>
  </Container>
);
