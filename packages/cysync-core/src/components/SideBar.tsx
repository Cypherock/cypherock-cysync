import {
  AngleRight,
  ArrowReceivedIcon,
  ArrowSentIcon,
  Button,
  DropDownItemProps,
  Flex,
  FloatingMenu,
  HistoryIcon,
  PortfolioIcon,
  SettingsIcon,
  SideBarItem,
  SideBarWrapper,
  SideBarState as State,
  SupportIcon,
  Synchronizing,
  TutorialIcon,
  WalletConnectWhiteIcon,
  WalletIcon,
  WalletInfoIcon,
  parseLangTemplate,
} from '@cypherock/cysync-ui';
import { IWallet } from '@cypherock/db-interfaces';
import React, { FC } from 'react';

import {
  openReceiveDialog,
  openSendDialog,
  openWalletConnectDialog,
} from '~/actions';
import { DeviceHandlingState, useDevice, useSidebar } from '~/context';

export interface SideBarWalletSubMenuProps {
  wallets: IWallet[];
}

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
  const { deviceHandlingState } = useDevice();

  const walletsSubMenuOptions: DropDownItemProps[] = wallets.map(wallet => {
    const deleted = deletedWallets.some(
      deletedWallet => wallet.__id === deletedWallet.__id,
    );
    return {
      id: wallet.__id,
      text: wallet.name,
      rightIcon: deleted ? (
        <Button
          variant="text"
          align="center"
          onClick={e => {
            e.stopPropagation();
          }}
          title={parseLangTemplate(strings.tooltip.walletDeleted, {
            walletName: wallet.name,
          })}
        >
          <WalletInfoIcon fill={theme.palette.muted.main} />
        </Button>
      ) : undefined,
      color: deleted ? 'errorDark' : undefined,
    };
  });

  const selectedWallet = wallets.find(
    wallet => getWalletState(wallet.__id) === State.active,
  );

  return (
    <SideBarWrapper title="cySync" width={312} height="screen">
      <Flex direction="column" gap={8} justify="space-between" height="full">
        <Flex direction="column" gap={0}>
          <SideBarItem
            text={strings.portfolio}
            Icon={PortfolioIcon}
            state={getState('portfolio')}
            onClick={() => navigate('portfolio')}
          />
          <FloatingMenu
            items={walletsSubMenuOptions}
            onChange={id => id && navigateWallet(id)}
            selectedItem={selectedWallet?.__id}
            maxVisibleItemCount={8}
            placement="right-start"
            noLeftImageInList
            width={200}
            offset={{ mainAxis: 32, crossAxis: 12 }}
            disabled={wallets.length === 0}
          >
            <SideBarItem
              text={strings.wallets}
              extraRight={<AngleRight />}
              extraLeft={
                <Button
                  variant="text"
                  align="center"
                  title="Sync Wallets"
                  pr={1}
                  disabled={deviceHandlingState !== DeviceHandlingState.USABLE}
                  onClick={onWalletSync}
                >
                  <Synchronizing
                    fill={theme.palette.muted.main}
                    opacity={
                      deviceHandlingState !== DeviceHandlingState.USABLE
                        ? 0.5
                        : 1
                    }
                    animate={
                      syncWalletStatus === 'loading' ? 'spin' : undefined
                    }
                  />
                </Button>
              }
              isCollapsed={isWalletCollapsed}
              setIsCollapsed={setIsWalletCollapsed}
              state={isWalletPage ? State.selected : undefined}
              Icon={WalletIcon}
            />
          </FloatingMenu>

          <SideBarItem
            text={strings.sendCrypto}
            Icon={ArrowSentIcon}
            state={wallets.length === 0 ? State.disabled : undefined}
            onClick={() => {
              dispatch(openSendDialog());
            }}
          />
          <SideBarItem
            text={strings.receiveCrypto}
            Icon={ArrowReceivedIcon}
            state={wallets.length === 0 ? State.disabled : undefined}
            onClick={() => {
              dispatch(openReceiveDialog());
            }}
          />
          <SideBarItem
            text={strings.history}
            Icon={HistoryIcon}
            state={wallets.length === 0 ? State.disabled : getState('history')}
            onClick={() => navigate('history')}
          />
          <SideBarItem
            text={strings.walletConnect}
            Icon={WalletConnectWhiteIcon}
            state={wallets.length === 0 ? State.disabled : undefined}
            onClick={() => {
              dispatch(openWalletConnectDialog());
            }}
          />
        </Flex>
        <Flex direction="column" gap={0}>
          <SideBarItem
            text={strings.tutorial}
            Icon={TutorialIcon}
            state={getState('tutorial')}
            onClick={() => navigate('tutorial')}
          />
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
