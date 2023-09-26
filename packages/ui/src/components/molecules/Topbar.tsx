import React, { FC, ReactNode } from 'react';
import styled, { useTheme } from 'styled-components';

import {
  SyncingIcon,
  Connected,
  VisibilityHide,
  Visibility,
  Lock,
  LockOpen,
  Disconnected,
  DeviceErrorIcon,
  SyncProblem,
  SyncronizingBold,
  NoNotifications,
  Notifications,
  PushpinBold,
} from '../../assets';
import { Button, Container, Flex, LangDisplay, Typography } from '../atoms';
import { svgGradients } from '../GlobalStyles';

export type SyncStatusType = 'syncronized' | 'syncronizing' | 'error';
export type ConnectionStatusType = 'connected' | 'error' | 'disconnected';

interface ITopbar {
  title: string;
  icon?: ReactNode;
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
  onSyncClick: () => void;
  showIcon?: boolean;
  onIconClick?: () => void;
}

const DividingLine = styled.div`
  width: 1px;
  background-color: ${props =>
    props.theme.palette.background.separatorSecondary};
  height: 23.33px;
`;

const TitleStyle = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const Topbar: FC<ITopbar> = ({
  title,
  icon,
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
  onSyncClick,
  showIcon,
  onIconClick,
}) => {
  const theme = useTheme();

  const connectionStatusMap = {
    connected: <Connected fill={theme?.palette.success.main} />,
    error: <DeviceErrorIcon fill={theme?.palette.warn.main} />,
    disconnected: <Disconnected fill={theme?.palette.warn.main} />,
  };

  const syncStatusMap = {
    syncronized: <SyncingIcon />,
    syncronizing: (
      <SyncronizingBold fill={`url(#${svgGradients.gold})`} animate="spin" />
    ),
    error: <SyncProblem fill={theme?.palette.warn.main} />,
  };

  return (
    <Container
      px={{ def: 4, mdlg: 5 }}
      pt={{ def: '8', mdlg: '50' }}
      pb={{ def: '8', mdlg: '10' }}
      $bgColor="contentGradient"
      $borderWidthB={1}
      $borderColor="topbar"
      width="full"
      justify="space-between"
      shadow="popup"
    >
      <TitleStyle>
        <Container direction="row">
          {icon ?? null}
          <Typography
            variant="h4"
            $fontWeight="semibold"
            color="silver"
            ml={icon ? 2 : 0}
          >
            <LangDisplay text={title} />
          </Typography>
        </Container>

        {showIcon && (
          <Button variant="icon" onClick={onIconClick} pl={5}>
            <PushpinBold />
          </Button>
        )}
      </TitleStyle>
      <Flex align="center">
        <Button variant="none" onClick={onSyncClick}>
          <Flex pr={2} align="center" gap={16}>
            {syncStatusMap[syncStatus]}
            <Typography display={{ def: 'none', mdlg: 'block' }} color="muted">
              <LangDisplay text={statusTexts.sync[syncStatus]} />
            </Typography>
          </Flex>
        </Button>
        <DividingLine />
        <Flex px={2} align="center" gap={16}>
          {connectionStatusMap[connectionStatus]}
          <Typography display={{ def: 'none', mdlg: 'block' }} color="muted">
            <LangDisplay text={statusTexts.connection[connectionStatus]} />
          </Typography>
        </Flex>
        <DividingLine />
        <Flex px={2} py="3" height="full" align="center" gap={16}>
          {haveNotifications ? <Notifications /> : <NoNotifications />}
        </Flex>
        <DividingLine />
        <Button variant="icon" onClick={toggleDiscreetMode}>
          <Flex px={2} py="3" align="center" gap={16}>
            {isDiscreetMode ? <VisibilityHide /> : <Visibility />}
          </Flex>
        </Button>
        {isPasswordSet && !isLockscreenLoading && (
          <>
            <DividingLine />
            <Button variant="icon" onClick={lock}>
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

Topbar.defaultProps = {
  showIcon: false,
  onIconClick: undefined,
  icon: undefined,
};
