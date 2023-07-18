import React, { FC } from 'react';
import { useTheme } from 'styled-components';

import {
  Check,
  Connected,
  VisibilityHide,
  Visibility,
  Lock,
  LockOpen,
  Disconnected,
  SyncProblem,
  Syncronizing,
  NoNotifications,
  Notifications,
} from '../../assets';
import { Container, Flex, LangDisplay, Typography } from '../atoms';
import { svgGradients } from '../GlobalStyles';

export type SyncStatusType = 'syncronized' | 'syncronizing' | 'error';
export type ConnectionStatusType = 'connected' | 'error' | 'disconnected';

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
  syncStatus: SyncStatusType;
  connectionStatus: ConnectionStatusType;
}> = ({
  title,
  statusTexts,
  connectionStatus,
  haveNotifications,
  isLock,
  isVisible,
  syncStatus,
}) => {
  const theme = useTheme();

  const connectionStatusMap = {
    connected: <Connected fill={theme!.palette.success.main} />,
    error: <Disconnected fill={theme!.palette.warn.main} />,
    disconnected: <Disconnected fill={theme!.palette.warn.main} />,
  };

  const syncStatusMap = {
    syncronized: <Check stroke={theme!.palette.success.main} />,
    syncronizing: <Syncronizing fill={`url(#${svgGradients.gold})`} />,
    error: <SyncProblem fill={theme!.palette.warn.main} />,
  };

  return (
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
          {syncStatusMap[syncStatus]}
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
          {connectionStatusMap[connectionStatus]}
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
          {haveNotifications ? <Notifications /> : <NoNotifications />}
        </Flex>
        <Flex
          px={2}
          py="3"
          $borderWidthR={1}
          $borderColor="separator"
          align="center"
          gap={16}
        >
          {isVisible ? <Visibility /> : <VisibilityHide />}
        </Flex>
        <Flex px={2} py="3" align="center" gap={16}>
          {isLock ? <Lock /> : <LockOpen />}
        </Flex>
      </Flex>
    </Container>
  );
};
