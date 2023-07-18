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

import { selectLanguage, useAppSelector } from '~/store';

export const SideBar: FC = () => {
  const strings = useAppSelector(selectLanguage).strings.sidebar;
  const theme = useTheme()!;

  return (
    <SideBarWrapper title="cySync" width={312} height="full">
      <Flex direction="column" gap={8} justify="space-between" height="full">
        <Flex direction="column" gap={8}>
          <SideBarItem
            text={strings.portfolio}
            Icon={PortfolioIcon}
            state={State.normal}
          />
          <SideBarItem
            text={strings.wallets}
            extraLeft={
              <Button
                variant="text"
                align="center"
                onClick={() => console.log('Syncronizing wallets')}
              >
                {' '}
                <Syncronizing fill={theme.palette.muted.main} />{' '}
              </Button>
            }
            Icon={WalletIcon}
            state={State.selected}
          >
            <SideBarItem text="Foo" state={State.normal} child="regular" />
            <SideBarItem text="Bar" state={State.disabled} child="regular" />
            <SideBarItem
              text="Baz"
              state={State.error}
              child="last"
              extraRight={
                <Button variant="text" align="center">
                  {' '}
                  <WalletInfoIcon fill={theme.palette.muted.main} />{' '}
                </Button>
              }
            />
          </SideBarItem>
          <SideBarItem
            text={strings.sendCrypto}
            Icon={ArrowSentIcon}
            state={State.normal}
          />
          <SideBarItem
            text={strings.receiveCrypto}
            Icon={ArrowReceivedIcon}
            state={State.normal}
          />
          <SideBarItem
            text={strings.history}
            Icon={HistoryIcon}
            state={State.disabled}
          />
        </Flex>
        <Flex direction="column" gap={8}>
          <SideBarItem
            text={strings.settings}
            Icon={SettingsIcon}
            state={State.normal}
          />
          <SideBarItem
            text={strings.help}
            Icon={SupportIcon}
            state={State.normal}
            svgStroke
          />
        </Flex>
      </Flex>
    </SideBarWrapper>
  );
};
