import React from 'react';
import {
  ArrowDown,
  Dropdown,
  Flex,
  LangDisplay,
  Typography,
} from '@cypherock/cysync-ui';
import { SettingsButton, TabItem } from '../components';
import { selectLanguage, useAppSelector } from '~/store';

export const GeneralSettings: React.FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { item } = strings.settings.tabs.general;

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
            <LangDisplay text={item.syncMobile} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.syncMobileDesc} />
          </Typography>
        </Flex>
        <Flex>
          <SettingsButton variant="primary" onClick={console.log}>
            <LangDisplay text={strings.buttons.showQRCode} />
          </SettingsButton>
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
          <SettingsButton variant="primary" onClick={console.log}>
            <LangDisplay text={strings.buttons.editAccount} />
          </SettingsButton>
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
          <ArrowDown />
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
        <Flex width={300}>
          <Dropdown
            items={[
              { text: 'USD (United States Dollar)', id: 'usd' },
              { text: 'INR (Indian Rupees)', id: 'inr' },
            ]}
            searchText="Search Currency"
            placeholderText="Select Currency"
            selectedItem="usd"
            onChange={console.log}
          />
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
        <Flex width={300}>
          <Dropdown
            items={[
              { text: 'English', id: 'en' },
              { text: 'Hindi (India)', id: 'hi' },
            ]}
            searchText="Search Language"
            placeholderText="Select Language"
            selectedItem="en"
            onChange={console.log}
          />
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
        <Flex width={300}>
          <Dropdown
            items={[
              {
                text: '(UTC +05:30) Chennai, Kolkata, Mumbai, New Delhi',
                id: 'in',
              },
            ]}
            searchText="Search Time"
            placeholderText="Select Time"
            selectedItem="in"
            onChange={console.log}
          />
        </Flex>
      </TabItem>
    </Flex>
  );
};
