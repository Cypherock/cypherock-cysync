import React from 'react';
import { Flex, LangDisplay, Typography } from '@cypherock/cysync-ui';
import { TabItem } from '../components';
import { selectLanguage, useAppSelector } from '~/store';

export const GeneralSettings: React.FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { item } = strings.settings.tabs.general;

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
            <LangDisplay text={item.syncMobile} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.syncMobileDesc} />
          </Typography>
        </Flex>
      </TabItem>
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.editAccount} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.editAccountDesc} />
          </Typography>
        </Flex>
      </TabItem>
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.toggleWalletOnPortfolio} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.toggleWalletOnPortfolioDesc} />
          </Typography>
        </Flex>
      </TabItem>
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.currency} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.currencyDesc} />
          </Typography>
        </Flex>
      </TabItem>
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.language} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.languageDesc} />
          </Typography>
        </Flex>
      </TabItem>
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.region} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.regionDesc} />
          </Typography>
        </Flex>
      </TabItem>
    </Flex>
  );
};
