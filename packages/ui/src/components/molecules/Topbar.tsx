import React, { FC } from 'react';

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
  noNotifications,
  notifications,
} from '../../assets';
import { getDefaultTheme } from '../../themes';
import { Container, Flex, Image, LangDisplay, Typography } from '../atoms';
import { svgGradients } from '../GlobalStyles';

const theme = getDefaultTheme();
const connectionStatusMap = {
  connected: <Connected fill={theme.palette.success.main} />,
  error: <Disconnected fill={theme.palette.warn.main} />,
  disconnected: <Disconnected fill={theme.palette.warn.main} />,
};

const syncStatusMap = {
  syncronized: <Check stroke={theme.palette.success.main} />,
  syncronizing: <Syncronizing fill={`url(#${svgGradients.gold})`} />,
  error: <SyncProblem fill={theme.palette.warn.main} />,
};

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
        {isVisible ? (
          <Visibility fill={theme.palette.muted.main} />
        ) : (
          <VisibilityHide fill={theme.palette.muted.main} />
        )}
      </Flex>
      <Flex px={2} py="3" align="center" gap={16}>
        {isLock ? (
          <Lock fill={theme.palette.muted.main} />
        ) : (
          <LockOpen fill={theme.palette.muted.main} />
        )}
      </Flex>
    </Flex>
  </Container>
);
