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
import React, { FC, useState } from 'react';
import { useTheme } from 'styled-components';

import { routes } from '~/constants';
import { useNavigateTo } from '~/hooks';
import { selectLanguage, selectWallets, useAppSelector } from '~/store';

type Page = 'portfolio' | 'wallet' | 'history' | 'settings' | 'help';

export const SideBar: FC = () => {
  const [active, setActive] = useState<string>(routes.portfolio.name);
  const strings = useAppSelector(selectLanguage).strings.sidebar;
  const { wallets, deletedWallets } = useAppSelector(selectWallets);
  const theme = useTheme()!;

  const navigateTo = useNavigateTo();
  const navigate = (page: Page) => {
    setActive(routes[page].name);
    navigateTo(routes[page].path);
  };

  const navigateWallet = (id: string | undefined) => {
    if (!id) return;
    setActive(`wallet-${id}`);
    navigateTo(`${routes.wallet.path}?id=${id}`);
  };

  const getState = (page: Page): State => {
    if (active === routes[page].name) return State.selected;
    return State.normal;
  };

  const getStateWallet = (id: string | undefined): State => {
    if (id && active === `wallet-${id}`) return State.active;
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
                align="center"
                onClick={e => {
                  e.stopPropagation();
                }}
              >
                <Syncronizing fill={theme.palette.muted.main} />
              </Button>
            }
            Icon={WalletIcon}
          >
            {wallets.map((wallet, idx) => {
              const child =
                idx === wallets.length - 1 && deletedWallets.length === 0
                  ? 'last'
                  : 'regular';
              return (
                <SideBarItem
                  key={`wallet-${wallet.__id}`}
                  text={wallet.name}
                  onClick={() => navigateWallet(wallet.__id)}
                  state={getStateWallet(wallet.__id)}
                  child={child}
                />
              );
            })}
            {deletedWallets.map((wallet, idx) => {
              const child =
                idx === deletedWallets.length - 1 ? 'last' : 'regular';
              return (
                <SideBarItem
                  key={`wallet-${wallet.__id}`}
                  text={wallet.name}
                  state={State.error}
                  extraRight={
                    <Button
                      variant="text"
                      align="center"
                      onClick={e => {
                        e.stopPropagation();
                      }}
                    >
                      <WalletInfoIcon fill={theme.palette.muted.main} />
                    </Button>
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
