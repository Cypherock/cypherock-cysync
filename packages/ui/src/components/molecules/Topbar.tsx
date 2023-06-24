import React, { FC } from 'react';
import { Container, Flex, Image, LangDisplay, Typography } from '../atoms';
import {
  checkIcon,
  connected,
  visibilityHideIcon,
  visibilityIcon,
  lock,
  lockOpen,
  noNotifications,
  notifications,
  redDisconnectedIcon,
  syncProblem,
  syncronizing,
} from '../../assets';

const connectionStatusMap = {
  connected: {
    src: connected,
  },
  error: {
    src: redDisconnectedIcon,
  },
  disconnected: {
    src: redDisconnectedIcon,
  },
};

const syncStatusMap = {
  syncronized: {
    src: checkIcon,
  },
  syncronizing: {
    src: syncronizing,
  },
  error: {
    src: syncProblem,
  },
};

export type ISyncStatus = 'syncronized' | 'syncronizing' | 'error';
export type IConnectionStatus = 'connected' | 'error' | 'disconnected';

export const Topbar: FC<{
  title: string;
  statusTexts: {
    connection: {
      connected: string;
      error: string;
      disconnected: string;
    };
    sync: {
      syncronized: string;
      syncronizing: string;
      error: string;
    };
  };
  isVisible: boolean;
  isLock: boolean;
  haveNotifications: boolean;
  syncStatus: ISyncStatus;
  connectionStatus: IConnectionStatus;
}> = ({
  title,
  statusTexts,
  connectionStatus,
  haveNotifications,
  isLock,
  isVisible,
  syncStatus,
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
      <Flex pr={2} $borderWidthR={1} align="center" gap={16}>
        <Image src={syncStatusMap[syncStatus].src} alt="syncState" />
        <Typography color="muted">
          <LangDisplay text={statusTexts.sync[syncStatus]} />
        </Typography>
      </Flex>
      <Flex
        px={2}
        $borderWidthR={1}
        $borderColor="separator"
        align="center"
        gap={16}
      >
        <Image
          src={connectionStatusMap[connectionStatus].src}
          alt="connectionState"
        />
        <Typography color="muted">
          <LangDisplay text={statusTexts.connection[connectionStatus]} />
        </Typography>
      </Flex>
      <Flex
        px={2}
        py="3"
        height="full"
        $borderWidthR={1}
        $borderColor="separator"
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
        $borderWidthR={1}
        $borderColor="separator"
        align="center"
        gap={16}
      >
        <Image
          src={isVisible ? visibilityIcon : visibilityHideIcon}
          alt="visiblity"
        />
      </Flex>
      <Flex px={2} py="3" align="center" gap={16}>
        <Image src={isLock ? lock : lockOpen} alt="lock" />
      </Flex>
    </Flex>
  </Container>
);
