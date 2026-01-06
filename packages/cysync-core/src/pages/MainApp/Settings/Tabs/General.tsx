import { LanguageList } from '@cypherock/cysync-core-constants';
import { Dropdown, Flex, LangDisplay } from '@cypherock/cysync-ui';
import React, { useCallback } from 'react';

import {
  setAppLanguage,
  openEditAccountDialog,
  openMobileAppSyncDialog,
} from '~/actions';
import { useCurrency } from '~/context';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';

import { SettingsButton, SettingsStandardItem } from '../components';

export const GeneralSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { strings, lang } = useAppSelector(selectLanguage);
  const { item } = strings.settings.tabs.general;
  const { availableCurrencies, currentCurrency, updateCurrency } =
    useCurrency();

  const onLangChange = useCallback(
    (id?: string) => {
      dispatch(setAppLanguage(id));
    },
    [dispatch],
  );

  const onCurrencyChange = useCallback(
    (id?: string) => {
      if (id) {
        updateCurrency(id);
      }
    },
    [updateCurrency],
  );

  return (
    <>
      <SettingsStandardItem
        title={{ text: item.editAccount.title }}
        description={{ text: item.editAccount.description }}
      >
        <SettingsButton
          variant="primary"
          onClick={() => dispatch(openEditAccountDialog())}
        >
          <LangDisplay text={strings.buttons.editAccount} />
        </SettingsButton>
      </SettingsStandardItem>
      {/* <SettingsStandardItem
        title={{ text: item.toggleWalletOnPortfolio.title }}
        description={{ text: item.toggleWalletOnPortfolio.description }}
      >
        <ArrowDown />
      </SettingsStandardItem> */}
      <SettingsStandardItem
        title={{ text: item.currency.title }}
        description={{ text: item.currency.description }}
      >
        <Flex width={300}>
          <Dropdown
            items={availableCurrencies.map(c => ({
              text: `${c.code.toUpperCase()} - ${c.name}`,
              id: c.code,
            }))}
            searchText="Search Currency"
            placeholderText="Select Currency"
            selectedItem={currentCurrency.toUpperCase()}
            onChange={onCurrencyChange}
          />
        </Flex>
      </SettingsStandardItem>
      <SettingsStandardItem
        title={{ text: item.language.title }}
        description={{ text: item.language.description }}
      >
        <Flex width={300}>
          <Dropdown
            items={LanguageList.map(l => ({
              text: l.name,
              id: l.id,
            }))}
            onChange={onLangChange}
            searchText="Search Language"
            placeholderText="Select Language"
            selectedItem={lang}
            noVirtualization
          />
        </Flex>
      </SettingsStandardItem>
      {window.cysyncEnv.VENDOR === 'default' && (
        <SettingsStandardItem
          title={{ text: item.syncMobile.title }}
          description={{ text: item.syncMobile.description }}
        >
          <SettingsButton
            variant="primary"
            onClick={() => dispatch(openMobileAppSyncDialog())}
          >
            <LangDisplay text={strings.buttons.showQRCode} />
          </SettingsButton>
        </SettingsStandardItem>
      )}
      {/* <SettingsStandardItem
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
      </SettingsStandardItem> */}
    </>
  );
};
