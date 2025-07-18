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
  const { strings, isFirmwareBtcOnly } = useAppSelector(selector);
  const { item } = strings.settings.tabs.device;
  const dispatch = useAppDispatch();
  return (
    <>
      {!isFirmwareBtcOnly && (
        <SettingsStandardItem
          title={{ text: 'Switch firmware to Bitcoin-only' }}
          description={{
            text: 'Bitcoin-only firmware only works with Bitcoin transactions.\nOnce switched to Bicoin-only firmware, you can nt switch back to multi-coin firmware',
          }}
        >
          <SettingsButton
            onClick={() => dispatch(openSwitchFirmwareDialog())}
            variant="primary"
          >
            <LangDisplay text="Switch firmware" />
          </SettingsButton>
        </SettingsStandardItem>
      )}
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
