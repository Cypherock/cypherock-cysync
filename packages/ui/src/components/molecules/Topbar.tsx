import lodash from 'lodash';
import React, { FC, ReactNode, useCallback } from 'react';
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
  SynchronizingBold,
  NoNotifications,
  Notifications,
  PushpinBold,
} from '../../assets';
import {
  Button,
  Container,
  Flex,
  LangDisplay,
  Tag,
  Tooltip,
  Typography,
} from '../atoms';
import { svgGradients } from '../GlobalStyles';

export type SyncStatusType = 'synchronized' | 'synchronizing' | 'error';
export type ConnectionStatusType = 'connected' | 'error' | 'disconnected';

export interface TopbarProps {
  title: string;
  subTitle?: string;
  tag?: string;
  icon?: ReactNode;
  statusTexts: {
    connection: {
      connected: string;
      error: string;
      disconnected: string;
    };
    sync: {
      synchronized: string;
      synchronizing: string;
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
  onNotificationClick: () => void;
  onSyncClick: () => void;
  tooltipText?: string;
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

export const Topbar: FC<TopbarProps> = ({
  title,
  subTitle,
  tag,
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
  tooltipText,
  toggleDiscreetMode,
  onSyncClick,
  showIcon,
  onIconClick,
  onNotificationClick,
}) => {
  const theme = useTheme();

  const debouncedToggleDiscreteMode = useCallback(
    lodash.debounce(toggleDiscreetMode, 100),
    [],
  );

  const connectionStatusMap = {
    connected: <Connected fill={theme?.palette.success.main} />,
    error: <DeviceErrorIcon fill={theme?.palette.warn.main} />,
    disconnected: <Disconnected fill={theme?.palette.warn.main} />,
  };

  const syncStatusMap = {
    synchronized: <SyncingIcon />,
    synchronizing: (
      <SynchronizingBold fill={`url(#${svgGradients.gold})`} animate="spin" />
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
          <Container direction="column" ml={icon ? 2 : 0} align="flex-start">
            <Typography variant="h4" $fontWeight="semibold" color="silver">
              <LangDisplay text={title} />
            </Typography>
            {(subTitle || tag) && (
              <Container direction="row">
                {subTitle && (
                  <Typography
                    $fontWeight="semibold"
                    $fontSize={14}
                    color="muted"
                    mr={1}
                  >
                    <LangDisplay text={subTitle} />
                  </Typography>
                )}
                {tag && <Tag>{tag}</Tag>}
              </Container>
            )}
          </Container>
        </Container>

        {showIcon && (
          <Button variant="icon" onClick={onIconClick} pl={5}>
            <PushpinBold />
          </Button>
        )}
      </TitleStyle>
      <Flex align="center">
        <Tooltip text={tooltipText} tooltipPlacement="bottom">
          <Button variant="none" onClick={onSyncClick}>
            <Flex pr={2} align="center" gap={16}>
              {syncStatusMap[syncStatus]}
              <Typography
                display={{ def: 'none', mdlg: 'block' }}
                color="muted"
              >
                <LangDisplay text={statusTexts.sync[syncStatus]} />
              </Typography>
            </Flex>
          </Button>
        </Tooltip>
        <DividingLine />
        <Flex px={2} align="center" gap={16}>
          {connectionStatusMap[connectionStatus]}
          <Typography display={{ def: 'none', mdlg: 'block' }} color="muted">
            <LangDisplay text={statusTexts.connection[connectionStatus]} />
          </Typography>
        </Flex>
        <DividingLine />
        <Button variant="icon" onClick={onNotificationClick}>
          <Flex px={2} py="3" height="full" align="center" gap={16}>
            {haveNotifications ? <Notifications /> : <NoNotifications />}
          </Flex>
        </Button>
        <DividingLine />
        <Button variant="icon" onClick={debouncedToggleDiscreteMode}>
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
  subTitle: undefined,
  tag: undefined,
  tooltipText: undefined,
};
