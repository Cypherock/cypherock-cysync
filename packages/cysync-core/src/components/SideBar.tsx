/* eslint-disable @typescript-eslint/no-unused-vars */
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
  Image,
  PortfolioIcon,
  SideBarItem,
  SideBarWrapper,
  SideBarState as State,
  Synchronizing,
  Typography,
  WalletConnectWhiteIcon,
  WalletIcon,
  DollarIcon,
  EarnIcon,
  WalletInfoIcon,
  parseLangTemplate,
  SidebarHandle,
  GraphSwitchSmallIcon,
  AffiliateIcon,
} from '@cypherock/cysync-ui';
import { cysyncLogoSmallImage } from '@cypherock/cysync-ui/src/assets/images/common';
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

const getItemState = (isDisabled: boolean, fallback?: State) =>
  isDisabled ? State.disabled : fallback;

const getSidebarVisibility = (isFirmwareBtcOnly: boolean) => ({
  walletConnect: window.cysyncFeatureFlags.WALLET_CONNECT && !isFirmwareBtcOnly,
  onramp: window.cysyncFeatureFlags.ONRAMP,
  swap: window.cysyncFeatureFlags.SWAP && !isFirmwareBtcOnly,
  cover: window.cysyncFeatureFlags.COVER,
  affiliate: window.cysyncFeatureFlags.AFFILIATE,
});

const RenderIf: FC<{ when: boolean; children: React.ReactNode }> = ({
  when,
  children,
}) =>
  // Fragment keeps the return type a valid element for FC
  // eslint-disable-next-line react/jsx-no-useless-fragment
  when ? <>{children}</> : null;

const NewChip: FC<{ label: string }> = ({ label }) => (
  <Chip $gradient="silver">
    <Typography $fontSize={10} $fontWeight="semibold" color="black">
      {label}
    </Typography>
  </Chip>
);

const WalletSyncButton: FC<{
  isUsable: boolean;
  isLoading: boolean;
  fill: string;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}> = ({ isUsable, isLoading, fill, onClick }) => (
  <Button
    variant="text"
    align="center"
    title="Sync Wallets"
    pr={1}
    disabled={!isUsable}
    onClick={onClick}
  >
    <Synchronizing
      fill={fill}
      opacity={!isUsable ? 0.5 : 1}
      animate={isLoading ? 'spin' : undefined}
    />
  </Button>
);

const SideBarComponent: FC = () => {
  const {
    getState,
    isWalletCollapsed,
    navigate,
    setIsWalletCollapsed,
    lang,
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
    isFirmwareBtcOnly,
  } = useSidebar();
  const { deviceHandlingState } = useDevice();
  const onReferEarnClick = () => {
    logger.info('Sidebar Click: Refer & Earn');
    navigate('referAndEarn');
  };

  const getWalletsSubMenuOptions = (): DropDownItemProps[] =>
    wallets.map(wallet => {
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

  const walletsSubMenuOptions = getWalletsSubMenuOptions();

  const getSelectedWallet = () =>
    wallets.find(wallet => getWalletState(wallet.__id) === State.active);

  const selectedWallet = getSelectedWallet();

  const isNoWallets = wallets.length === 0;
  const isDeviceUsable = deviceHandlingState === DeviceHandlingState.USABLE;
  const visible = getSidebarVisibility(isFirmwareBtcOnly);
  const newChip = <NewChip label={strings.new} />;

  const renderSidebarItems = () => (
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
        disabled={isNoWallets}
      >
        <SideBarItem
          text={strings.wallets}
          extraRight={<AngleRight />}
          extraLeft={
            <WalletSyncButton
              isUsable={isDeviceUsable}
              isLoading={syncWalletStatus === 'loading'}
              fill={theme.palette.muted.main}
              onClick={onWalletSync}
            />
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
        state={getItemState(isNoWallets)}
        onClick={() => {
          dispatch(openSendDialog());
        }}
      />
      <SideBarItem
        text={strings.receiveCrypto}
        Icon={ArrowReceivedIcon}
        state={getItemState(isNoWallets)}
        onClick={() => {
          dispatch(openReceiveDialog());
        }}
      />
      <SideBarItem
        text={strings.history}
        Icon={HistoryIcon}
        state={getItemState(isNoWallets, getState('history'))}
        onClick={() => navigate('history')}
      />
      <RenderIf when={visible.walletConnect}>
        <SideBarItem
          text={strings.walletConnect}
          Icon={WalletConnectWhiteIcon}
          state={getItemState(isNoWallets)}
          onClick={() => {
            dispatch(openWalletConnectDialog());
          }}
        />
      </RenderIf>
      <RenderIf when={visible.onramp}>
        <SideBarItem
          text={strings.buysell}
          Icon={DollarIcon}
          state={getItemState(isNoWallets, getState('buysell2'))}
          onClick={() => navigate('buysell2')}
          extraRight={newChip}
        />
      </RenderIf>
      <RenderIf when={visible.swap}>
        <SideBarItem
          text="Swap"
          Icon={GraphSwitchSmallIcon}
          state={getItemState(isNoWallets, getState('swap'))}
          onClick={() => navigate('swap')}
          extraRight={newChip}
        />
      </RenderIf>
      <RenderIf when={visible.cover}>
        <SideBarItem
          text={strings.cypherockCover}
          Icon={CypherockCoverIcon}
          state={getItemState(isNoWallets, getState('inheritance'))}
          onClick={() => navigate('inheritance')}
        />
      </RenderIf>
      <SideBarItem
        text="Earn"
        Icon={EarnIcon}
        state={getItemState(isNoWallets, getState('earn'))}
        onClick={() => navigate('earn')}
        extraRight={newChip}
      />
      <RenderIf when={visible.affiliate}>
        <SideBarItem
          text={strings.referAndEarn}
          Icon={AffiliateIcon}
          state={getState('referAndEarn')}
          onClick={onReferEarnClick}
        />
      </RenderIf>
    </Flex>
  );

  const renderFooter = () =>
    window.cysyncEnv.VENDOR !== 'default' && (
      <Flex align="center" justify="flex-start" gap={8} pt="16px" mt="16px">
        <Image src={cysyncLogoSmallImage} alt="Cypherock" $height={20} />
        <Typography
          variant="h6"
          color="muted"
          $fontSize={14}
          $fontWeight="medium"
        >
          {strings.securedBy}
        </Typography>
      </Flex>
    );

  return (
    <>
      <SideBarWrapper
        title={
          lang.strings.appName === 'Odix' ? 'ODIX WALLET' : lang.strings.appName
        }
        width={width}
        height="screen"
      >
        <Flex direction="column" gap={8} justify="space-between" height="full">
          {renderSidebarItems()}
        </Flex>
        {renderFooter()}
      </SideBarWrapper>
      {window.cysyncEnv.VENDOR === 'default' && (
        <SidebarHandle onMouseDown={startDrag} />
      )}
    </>
  );
};

export const SideBar = React.memo(SideBarComponent);
