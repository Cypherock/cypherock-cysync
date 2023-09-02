import React from 'react';
import { Flex, LangDisplay, Typography } from '@cypherock/cysync-ui';
import { TabItem } from '../components';
import { selectLanguage, useAppSelector } from '~/store';

export const DeviceSettings: React.FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { item } = strings.settings.tabs.device;
  return (
    <Flex
      $alignSelf="stretch"
      direction="column"
      align="stretch"
      px={5}
      py={4}
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
      </TabItem>
    </Flex>
  );
};
