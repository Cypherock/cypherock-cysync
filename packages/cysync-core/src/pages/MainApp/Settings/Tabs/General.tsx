import { ArrowDown, Dropdown, Flex, LangDisplay } from '@cypherock/cysync-ui';
import React from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { SettingsButton, SettingsStandardItem } from '../components';

export const GeneralSettings: React.FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { item } = strings.settings.tabs.general;

  return (
    <>
      <SettingsStandardItem
        title={{ text: item.syncMobile.title }}
        description={{ text: item.syncMobile.description }}
      >
        <SettingsButton variant="primary" onClick={console.log}>
          <LangDisplay text={strings.buttons.showQRCode} />
        </SettingsButton>
      </SettingsStandardItem>
      <SettingsStandardItem
        title={{ text: item.editAccount.title }}
        description={{ text: item.editAccount.description }}
      >
        <SettingsButton variant="primary" onClick={console.log}>
          <LangDisplay text={strings.buttons.editAccount} />
        </SettingsButton>
      </SettingsStandardItem>
      <SettingsStandardItem
        title={{ text: item.toggleWalletOnPortfolio.title }}
        description={{ text: item.toggleWalletOnPortfolio.description }}
      >
        <ArrowDown />
      </SettingsStandardItem>
      <SettingsStandardItem
        title={{ text: item.currency.title }}
        description={{ text: item.currency.description }}
      >
        <Flex width={300}>
          <Dropdown
            items={[
              { text: 'USD (United States Dollar)', id: 'usd' },
              { text: 'INR (Indian Rupees)', id: 'inr' },
            ]}
            searchText="Search Currency"
            placeholderText="Select Currency"
            selectedItem="usd"
          />
        </Flex>
      </SettingsStandardItem>
      <SettingsStandardItem
        title={{ text: item.language.title }}
        description={{ text: item.language.description }}
      >
        <Flex width={300}>
          <Dropdown
            items={[
              { text: 'English', id: 'en' },
              { text: 'Hindi (India)', id: 'hi' },
            ]}
            searchText="Search Language"
            placeholderText="Select Language"
            selectedItem="en"
          />
        </Flex>
      </SettingsStandardItem>
      <SettingsStandardItem
        title={{ text: item.region.title }}
        description={{ text: item.region.description }}
      >
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
          />
        </Flex>
      </SettingsStandardItem>
    </>
  );
};
