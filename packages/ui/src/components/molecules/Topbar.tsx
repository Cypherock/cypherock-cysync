import React, { FC } from 'react';
import styled, { useTheme } from 'styled-components';

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
import { Button, Container, Flex, LangDisplay, Typography } from '../atoms';
import { svgGradients } from '../GlobalStyles';

export type SyncStatusType = 'syncronized' | 'syncronizing' | 'error';
export type ConnectionStatusType = 'connected' | 'error' | 'disconnected';

const DividingLine = styled.div`
  width: 1px;
  background-color: ${props =>
    props.theme.palette.background.separatorSecondary};
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
}) => {
  const theme = useTheme();

  const connectionStatusMap = {
    connected: <Connected fill={theme?.palette.success.main} />,
    error: <Disconnected fill={theme?.palette.warn.main} />,
    disconnected: <Disconnected fill={theme?.palette.warn.main} />,
  };

  const syncStatusMap = {
    syncronized: <Check stroke={theme?.palette.success.main} />,
    syncronizing: <Syncronizing fill={`url(#${svgGradients.gold})`} />,
    error: <SyncProblem fill={theme?.palette.warn.main} />,
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
        <Flex pr={2} align="center" gap={16}>
          {syncStatusMap[syncStatus]}
          <Typography color="muted">
            <LangDisplay text={statusTexts.sync[syncStatus]} />
          </Typography>
        </Flex>
        <DividingLine />
        <Flex px={2} align="center" gap={16}>
          {connectionStatusMap[connectionStatus]}
          <Typography color="muted">
            <LangDisplay text={statusTexts.connection[connectionStatus]} />
          </Typography>
        </Flex>
        <DividingLine />
        <Flex px={2} py="3" height="full" align="center" gap={16}>
          {haveNotifications ? <Notifications /> : <NoNotifications />}
        </Flex>
        <DividingLine />
        <Button variant="text" onClick={toggleDiscreetMode}>
          <Flex px={2} py="3" align="center" gap={16}>
            {isDiscreetMode ? <Visibility /> : <VisibilityHide />}
          </Flex>
        </Button>

        {isPasswordSet && !isLockscreenLoading && (
          <>
            <DividingLine />
            <Button variant="text" onClick={lock}>
              <Flex px={2} py="3" align="center" gap={16}>
                {isLocked ? <Lock /> : <LockOpen />}
              </Flex>
            </Button>
          </>
        )}
      </Flex>
    </Container>
  );
};
