import { LangDisplay } from '@cypherock/cysync-ui';
import { createSelector } from '@reduxjs/toolkit';
import React from 'react';

import {
  openAuthenticateX1CardDialog,
  openAuthenticateX1VaultDialog,
  openSwitchFirmwareDialog,
} from '~/actions';
import {
  selectLanguage,
  selectLastConnectedFirmware,
  useAppDispatch,
  useAppSelector,
} from '~/store';

import { SettingsButton, SettingsStandardItem } from '../components';

const selector = createSelector(
  [selectLanguage, selectLastConnectedFirmware],
  ({ strings }, { isFirmwareBtcOnly }) => ({
    strings,
    isFirmwareBtcOnly,
  }),
);

export const DeviceSettings: React.FC = () => {
  const dispatch = useAppDispatch();
  const { strings, isFirmwareBtcOnly } = useAppSelector(selector);
  const { item } = strings.settings.tabs.device;
  const switchFirmwareText = isFirmwareBtcOnly
    ? item.switchFirmware.multiCoin
    : item.switchFirmware.btcOnly;
  return (
    <>
      <SettingsStandardItem
        title={{ text: switchFirmwareText.title }}
        description={{ text: switchFirmwareText.description }}
      >
        <SettingsButton
          onClick={() => dispatch(openSwitchFirmwareDialog())}
          variant="primary"
        >
          <LangDisplay text={strings.buttons.switchFirmware} />
        </SettingsButton>
      </SettingsStandardItem>
      <SettingsStandardItem
        title={{ text: item.x1VaultAuth.title }}
        description={{ text: item.x1VaultAuth.description }}
      >
        <SettingsButton
          onClick={() => dispatch(openAuthenticateX1VaultDialog())}
          variant="primary"
        >
          <LangDisplay text={strings.buttons.authenticate} />
        </SettingsButton>
      </SettingsStandardItem>
      <SettingsStandardItem
        title={{ text: item.x1CardAuth.title }}
        description={{ text: item.x1CardAuth.description }}
      >
        <SettingsButton
          variant="primary"
          onClick={() => dispatch(openAuthenticateX1CardDialog())}
        >
          <LangDisplay text={strings.buttons.authenticate} />
        </SettingsButton>
      </SettingsStandardItem>
      {/* <SettingsStandardItem
        title={{ text: item.transferWallet.title }}
        description={{ text: item.transferWallet.description }}
      >
        <ArrowDown />
      </SettingsStandardItem> */}
    </>
  );
};
