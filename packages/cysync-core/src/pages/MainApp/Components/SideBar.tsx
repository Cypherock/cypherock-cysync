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
import { useTheme } from 'styled-components';

import { selectLanguage, selectWallets, useAppSelector } from '~/store';

export const SideBar: FC = () => {
  const strings = useAppSelector(selectLanguage).strings.sidebar;
  const { wallets, deletedWallets } = useAppSelector(selectWallets);
  const theme = useTheme()!;

  return (
    <SideBarWrapper title="cySync" width={312} height="full">
      <Flex direction="column" gap={8} justify="space-between" height="full">
        <Flex direction="column" gap={8}>
          <SideBarItem
            text={strings.portfolio}
            Icon={PortfolioIcon}
            state={State.selected}
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
                  key={`wallet-${idx + 1}`}
                  text={wallet.name}
                  state={State.normal}
                  child={child}
                />
              );
            })}
            {deletedWallets.map((wallet, idx) => {
              const child =
                idx === deletedWallets.length - 1 ? 'last' : 'regular';
              return (
                <SideBarItem
                  key={`deleted-wallet-${idx + 1}`}
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
            state={State.disabled}
          />
        </Flex>
        <Flex direction="column" gap={8}>
          <SideBarItem text={strings.settings} Icon={SettingsIcon} />
          <SideBarItem text={strings.help} Icon={SupportIcon} svgStroke />
        </Flex>
      </Flex>
    </SideBarWrapper>
  );
};
