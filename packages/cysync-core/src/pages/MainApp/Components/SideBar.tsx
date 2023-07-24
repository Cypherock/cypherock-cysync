import {
  SideBarWrapper,
  SideBarItem,
  SideBarState as State,
  Flex,
  Button,
  PortfolioIcon,
  WalletIcon,
  ArrowSentIcon,
  ArrowReceivedIcon,
  HistoryIcon,
  SettingsIcon,
  SupportIcon,
  Syncronizing,
  WalletInfoIcon,
} from '@cypherock/cysync-ui';
import React, { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from 'styled-components';

import { fetchWalletsAndSync } from '~/actions';
import { routes } from '~/constants';
import { DeviceConnectionStatus, useDevice } from '~/context';
import { useNavigateTo, useQuery } from '~/hooks';
import {
  selectLanguage,
  selectWallets,
  useAppSelector,
  useAppDispatch,
} from '~/store';

type Page = 'portfolio' | 'wallet' | 'history' | 'settings' | 'help';

export const SideBar: FC<{ collapseWallets?: boolean }> = () => {
  const location = useLocation();
  const query = useQuery();
  const dispatch = useAppDispatch();
  const strings = useAppSelector(selectLanguage).strings.sidebar;
  const { wallets, deletedWallets } = useAppSelector(selectWallets);
  const theme = useTheme()!;
  const navigateTo = useNavigateTo();
  const { connection, connectDevice } = useDevice();

  const connected = connection?.status === DeviceConnectionStatus.CONNECTED;

  const navigate = (page: Page) => {
    navigateTo(routes[page].path);
  };
  const navigateWallet = (id: string | undefined) => {
    if (!id) return;
    navigateTo(`${routes.wallet.path}?id=${id}`);
  };

  const getState = (page: Page): State => {
    if (location.pathname === routes[page].path) return State.selected;
    return State.normal;
  };
  const getStateWallet = (id: string | undefined): State => {
    if (
      id &&
      location.pathname === routes.wallet.path &&
      query.get('id') === id
    )
      return State.active;
    return State.normal;
  };

  return (
    <SideBarWrapper title="cySync" width={312} height="full">
      <Flex direction="column" gap={8} justify="space-between" height="full">
        <Flex direction="column" gap={8}>
          <SideBarItem
            text={strings.portfolio}
            Icon={PortfolioIcon}
            state={getState('portfolio')}
            onClick={() => navigate('portfolio')}
          />
          <SideBarItem
            text={strings.wallets}
            extraLeft={
              <Button
                variant="text"
                disabled={!connected}
                align="center"
                title="Sync Wallets"
                onClick={e => {
                  dispatch(fetchWalletsAndSync({ connection, connectDevice }));
                  e.stopPropagation();
                }}
              >
                <Syncronizing
                  fill={
                    connected
                      ? theme.palette.muted.main
                      : theme.palette.text.disabled
                  }
                />
              </Button>
            }
            isCollapsed={location.pathname !== routes.wallet.path}
            state={
              location.pathname === routes.wallet.path
                ? State.selected
                : undefined
            }
            Icon={WalletIcon}
          >
            {wallets.map((wallet, idx) => {
              const child = idx === wallets.length - 1 ? 'last' : 'regular';
              const deleted = deletedWallets.some(
                deletedWallet => wallet.__id === deletedWallet.__id,
              );
              return (
                <SideBarItem
                  key={`wallet-${wallet.__id}`}
                  text={wallet.name}
                  onClick={() => navigateWallet(wallet.__id)}
                  state={deleted ? State.error : getStateWallet(wallet.__id)}
                  extraRight={
                    deleted && (
                      <Button
                        variant="text"
                        align="center"
                        onClick={e => {
                          e.stopPropagation();
                        }}
                      >
                        <WalletInfoIcon fill={theme.palette.muted.main} />
                      </Button>
                    )
                  }
                  child={child}
                />
              );
            })}
          </SideBarItem>
          <SideBarItem text={strings.sendCrypto} Icon={ArrowSentIcon} />
          <SideBarItem text={strings.receiveCrypto} Icon={ArrowReceivedIcon} />
          <SideBarItem
            text={strings.history}
            Icon={HistoryIcon}
            state={getState('history')}
            onClick={() => navigate('history')}
          />
        </Flex>
        <Flex direction="column" gap={8}>
          <SideBarItem
            text={strings.settings}
            Icon={SettingsIcon}
            state={getState('settings')}
            onClick={() => navigate('settings')}
          />
          <SideBarItem
            text={strings.help}
            Icon={SupportIcon}
            svgStroke
            state={getState('help')}
            onClick={() => navigate('help')}
          />
        </Flex>
      </Flex>
    </SideBarWrapper>
  );
};
