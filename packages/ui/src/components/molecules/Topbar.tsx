import React, { FC } from 'react';
import styled from 'styled-components';

import {
  checkIcon,
  connected,
  visibilityHideIcon,
  visibilityIcon,
  lockIcon,
  lockOpenIcon,
  noNotificationsIcon,
  notificationsIcon,
  redDisconnectedIcon,
  syncProblemIcon,
  syncronizingIcon,
} from '../../assets';
import { theme } from '../../themes/theme.styled';
import {
  Button,
  Container,
  Flex,
  Image,
  LangDisplay,
  Typography,
} from '../atoms';

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
    src: syncronizingIcon,
  },
  error: {
    src: syncProblemIcon,
  },
};

export type SyncStatusType = 'syncronized' | 'syncronizing' | 'error';
export type ConnectionStatusType = 'connected' | 'error' | 'disconnected';

const DividingLine = styled.div`
  width: 1px;
  background-color: ${theme.palette.background.separatorSecondary};
  height: 23.33px;
`;

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
  isDiscreetMode: boolean;
  lock: () => void;
  isPasswordSet: boolean;
  isLocked: boolean;
  isLockscreenLoading: boolean;
  haveNotifications: boolean;
  syncStatus: SyncStatusType;
  connectionStatus: ConnectionStatusType;
  toggleDiscreetMode: () => void;
}> = ({
  title,
  statusTexts,
  connectionStatus,
  haveNotifications,
  isLocked,
  isLockscreenLoading,
  lock,
  isPasswordSet,
  isDiscreetMode,
  syncStatus,
  toggleDiscreetMode,
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
      <Flex pr={2} align="center" gap={16}>
        <Image src={syncStatusMap[syncStatus].src} alt="syncState" />
        <Typography color="muted">
          <LangDisplay text={statusTexts.sync[syncStatus]} />
        </Typography>
      </Flex>
      <DividingLine />
      <Flex px={2} align="center" gap={16}>
        <Image
          width={31}
          src={connectionStatusMap[connectionStatus].src}
          alt="connectionState"
        />
        <Typography color="muted">
          <LangDisplay text={statusTexts.connection[connectionStatus]} />
        </Typography>
      </Flex>
      <DividingLine />
      <Flex px={2} py="3" height="full" align="center" gap={16}>
        <Image
          src={haveNotifications ? notificationsIcon : noNotificationsIcon}
          alt="notifications"
        />
      </Flex>
      <DividingLine />
      <Button variant="text" onClick={toggleDiscreetMode}>
        <Flex px={2} py="3" align="center" gap={16}>
          <Image
            src={isDiscreetMode ? visibilityIcon : visibilityHideIcon}
            alt="visiblity"
          />
        </Flex>
      </Button>

      {isPasswordSet && !isLockscreenLoading && (
        <>
          <DividingLine />
          <Button variant="text" onClick={lock}>
            <Flex px={2} py="3" align="center" gap={16}>
              <Image src={isLocked ? lockIcon : lockOpenIcon} alt="lock" />
            </Flex>
          </Button>
        </>
      )}
    </Flex>
  </Container>
);
