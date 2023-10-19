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

import { openSendDialog, openReceiveDialog } from '~/actions';
import { useSidebar } from '~/context';

const SideBarComponent: FC<{ collapseWallets?: boolean }> = () => {
  const {
    getState,
    isWalletCollapsed,
    navigate,
    setIsWalletCollapsed,
    strings,
    theme,
    syncWalletStatus,
    wallets,
    onWalletSync,
    deletedWallets,
    navigateWallet,
    getWalletState,
    dispatch,
    isWalletPage,
  } = useSidebar();

  return (
    <SideBarWrapper title="cySync" width={312} height="screen">
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
                title="Sync Wallets"
                onClick={onWalletSync}
              >
                <Syncronizing
                  fill={theme.palette.muted.main}
                  animate={syncWalletStatus === 'loading' ? 'spin' : undefined}
                />
              </Button>
            }
            isCollapsed={isWalletCollapsed}
            setIsCollapsed={setIsWalletCollapsed}
            state={isWalletPage ? State.selected : undefined}
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
                  state={deleted ? State.error : getWalletState(wallet.__id)}
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
          <SideBarItem
            text={strings.sendCrypto}
            Icon={ArrowSentIcon}
            onClick={() => {
              dispatch(openSendDialog());
            }}
          />
          <SideBarItem
            text={strings.receiveCrypto}
            Icon={ArrowReceivedIcon}
            onClick={() => {
              dispatch(openReceiveDialog());
            }}
          />
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

export const SideBar = React.memo(SideBarComponent);
