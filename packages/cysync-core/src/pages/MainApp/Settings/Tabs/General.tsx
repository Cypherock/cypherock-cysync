import React from 'react';
import { Button, Flex, LangDisplay, Typography } from '@cypherock/cysync-ui';
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
        <Flex>
          <Button variant="primary" onClick={console.log}>
            <LangDisplay text={strings.buttons.showQRCode} />
          </Button>
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
        <Flex>
          <Button variant="primary" onClick={console.log}>
            <LangDisplay text={strings.buttons.editAccount} />
          </Button>
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
        <Flex>
          <Typography> Bohot Saare Check Boxes </Typography>
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
        <Flex>
          <Typography> USD (United States Dollar) </Typography>
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
        <Flex>
          <Typography> Hindi (India) </Typography>
        </Flex>
      </TabItem>
    </Flex>
  );
};
