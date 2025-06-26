import {
  AngleRight,
  ArrowReceivedIcon,
  ArrowSentIcon,
  Button,
  Chip,
  CypherockCoverIcon,
  DropDownItemProps,
  Flex,
  FloatingMenu,
  HistoryIcon,
  PortfolioIcon,
  SideBarItem,
  SideBarWrapper,
  SideBarState as State,
  Synchronizing,
  Typography,
  WalletConnectWhiteIcon,
  WalletIcon,
  DollarIcon,
  WalletInfoIcon,
  AffiliateIcon,
  parseLangTemplate,
  GraphSwitchSmallIcon,
  SidebarHandle,
} from '@cypherock/cysync-ui';
import { IWallet } from '@cypherock/db-interfaces';
import React, { FC } from 'react';

import {
  openReceiveDialog,
  openSendDialog,
  openWalletConnectDialog,
} from '~/actions';
import { DeviceHandlingState, useDevice, useSidebar } from '~/context';
import logger from '~/utils/logger';

export interface SideBarWalletSubMenuProps {
  wallets: IWallet[];
}

const SideBarComponent: FC = () => {
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
    startDrag,
    width,
  } = useSidebar();
  const { deviceHandlingState } = useDevice();
  const onReferEarnClick = () => {
    logger.info('Sidebar Click: Refer & Earn');
    navigate('referAndEarn');
  };

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
    <>
      <SideBarWrapper title="cySync" width={width} height="screen">
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
                    disabled={
                      deviceHandlingState !== DeviceHandlingState.USABLE
                    }
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
              state={
                wallets.length === 0 ? State.disabled : getState('history')
              }
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
            <SideBarItem
              text={strings.buysell}
              Icon={DollarIcon}
              state={
                wallets.length === 0 ? State.disabled : getState('buysell')
              }
              onClick={() => navigate('buysell')}
            />
            <SideBarItem
              text="Swap"
              Icon={GraphSwitchSmallIcon}
              state={wallets.length === 0 ? State.disabled : getState('swap')}
              onClick={() => navigate('swap')}
              extraRight={
                <Chip $gradient="silver">
                  <Typography
                    $fontSize={10}
                    $fontWeight="semibold"
                    color="black"
                  >
                    {strings.new}
                  </Typography>
                </Chip>
              }
            />
            <SideBarItem
              text={strings.cypherockCover}
              Icon={CypherockCoverIcon}
              state={
                wallets.length === 0 ? State.disabled : getState('inheritance')
              }
              onClick={() => navigate('inheritance')}
            />
            <SideBarItem
              text={strings.referAndEarn}
              Icon={AffiliateIcon}
              state={getState('referAndEarn')}
              onClick={onReferEarnClick}
            />
          </Flex>
        </Flex>
      </SideBarWrapper>
      <SidebarHandle onMouseDown={startDrag} />
    </>
  );
};

export const SideBar = React.memo(SideBarComponent);
