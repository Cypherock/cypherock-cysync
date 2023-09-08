import React from 'react';
import { ArrowDown, Flex, LangDisplay, Typography } from '@cypherock/cysync-ui';
import { SettingsButton, TabItem } from '../components';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';
import {
  openAuthenticateX1CardDialog,
  openAuthenticateX1VaultDialog,
} from '~/actions';

export const DeviceSettings: React.FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { item } = strings.settings.tabs.device;
  const dispatch = useAppDispatch();
  return (
    <Flex
      $alignSelf="stretch"
      direction="column"
      align="stretch"
      px={{ def: 3, lg: 5 }}
      py={{ def: 2, lg: 4 }}
      gap={32}
    >
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.x1VaultUpdate} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.x1VaultUpdateDesc} />
          </Typography>
        </Flex>
        <Flex>
          <SettingsButton variant="primary" onClick={console.log}>
            <LangDisplay text={strings.buttons.check} />
          </SettingsButton>
        </Flex>
      </TabItem>
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.x1VaultAuth} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.x1VaultAuthDesc} />
          </Typography>
        </Flex>
        <Flex>
          <SettingsButton
            variant="primary"
            onClick={() => dispatch(openAuthenticateX1VaultDialog())}
          >
            <LangDisplay text={strings.buttons.authenticate} />
          </SettingsButton>
        </Flex>
      </TabItem>
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.x1CardAuth} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.x1CardAuthDesc} />
          </Typography>
        </Flex>
        <Flex>
          <SettingsButton
            variant="primary"
            onClick={() => dispatch(openAuthenticateX1CardDialog())}
          >
            <LangDisplay text={strings.buttons.authenticate} />
          </SettingsButton>
        </Flex>
      </TabItem>
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.transferWallet} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.transferWalletDesc} />
          </Typography>
        </Flex>
        <Flex>
          <ArrowDown />
        </Flex>
      </TabItem>
    </Flex>
  );
};
