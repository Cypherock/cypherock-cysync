import type { Meta, StoryObj } from '@storybook/react';
import React, { FC, ReactNode } from 'react';

import {
  ArrowReceivedIcon,
  PortfolioIcon,
  SettingsIcon,
  SupportIcon,
  Syncronizing,
  WalletIcon,
  WalletInfoIcon,
} from '../../assets';
import { SideBarWrapper, SideBarItem, Flex, Button } from '../../components';
import { getDefaultTheme } from '../../themes';

const meta: Meta<typeof SideBarWrapper> = {
  component: SideBarWrapper,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

const theme = getDefaultTheme();

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <Flex direction="column" gap={8} justify="space-between" height="full">
    {children}
  </Flex>
);

const wallets = [
  {
    __id: 'id_1',
    name: 'Wallet 1',
    state: 1,
  },
  {
    __id: 'id_2',
    name: 'Wallet 2',
    state: 2,
    deleted: true,
  },
  {
    __id: 'id_3',
    name: 'Wallet 3',
    state: 4,
  },
];

export const Default: Story = {
  args: {
    title: 'cySync',
    height: 'screen',
    width: 312,
    children: (
      <Wrapper>
        <Flex direction="column" gap={8}>
          <SideBarItem text="Portfolio" Icon={PortfolioIcon} state={3} />
          <SideBarItem text="Recieve Crypto" Icon={ArrowReceivedIcon} />
          <SideBarItem text="History" state={1} />
        </Flex>
        <Flex direction="column" gap={8}>
          <SideBarItem text="Settings" Icon={SettingsIcon} state={1} />
          <SideBarItem text="Help" Icon={SupportIcon} svgStroke state={1} />
        </Flex>
      </Wrapper>
    ),
  },
};

export const Wallets: Story = {
  args: {
    ...Default.args,
    children: (
      <Wrapper>
        <Flex direction="column" gap={8}>
          <SideBarItem text="Portfolio" Icon={PortfolioIcon} state={3} />
          <SideBarItem text="Recieve Crypto" Icon={ArrowReceivedIcon} />
          <SideBarItem text="History" state={1} />

          <SideBarItem
            text="Wallets"
            isCollapsed={false}
            state={3}
            Icon={WalletIcon}
            extraLeft={
              <Button variant="text" align="center" title="Sync Wallets">
                <Syncronizing fill={theme.palette.muted.main} />
              </Button>
            }
          >
            {wallets.map((wallet, idx) => {
              const child = idx === wallets.length - 1 ? 'last' : 'regular';
              return (
                <SideBarItem
                  key={`wallet-${wallet.__id}`}
                  text={wallet.name}
                  state={wallet.state}
                  child={child}
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
                />
              );
            })}
          </SideBarItem>
        </Flex>
        <Flex direction="column" gap={8}>
          <SideBarItem text="Settings" Icon={SettingsIcon} state={1} />
          <SideBarItem text="Help" Icon={SupportIcon} svgStroke state={1} />
        </Flex>
      </Wrapper>
    ),
  },
};
