import { LangDisplay, Toggle } from '@cypherock/cysync-ui';
import React, { useState } from 'react';

import {
  openChangePasswordDialog,
  openRemovePasswordDialog,
  openResetCySyncDialog,
  openSetPasswordDialog,
} from '~/actions';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';

import { SettingsStandardItem, SettingsButton } from '../components';
import { useLockscreen } from '~/context';

export const AppSettings: React.FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { item } = strings.settings.tabs.app;
  const dispatch = useAppDispatch();
  const [isAnalyticsAndBugReportEnabled, setAnalyticsAndBugReportEnabled] =
    useState<boolean>(false);
  const [isAutoUpdateCySyncEnabled, setAutoUpdateCySyncEnabled] =
    useState<boolean>(false);
  const { isPasswordSet } = useLockscreen();

  return (
    <>
      <SettingsStandardItem
        title={{ text: item.password.title }}
        description={{ text: item.password.description }}
      >
        <SettingsButton
          display={isPasswordSet ? 'none' : undefined}
          onClick={() => dispatch(openSetPasswordDialog())}
          variant="primary"
        >
          <LangDisplay text={strings.buttons.setPassword} />
        </SettingsButton>
        <SettingsButton
          display={isPasswordSet ? undefined : 'none'}
          onClick={() => dispatch(openRemovePasswordDialog())}
          variant="primary"
        >
          <LangDisplay text={strings.buttons.removePassword} />
        </SettingsButton>
        <SettingsButton
          display={isPasswordSet ? undefined : 'none'}
          onClick={() => dispatch(openChangePasswordDialog())}
          variant="primary"
        >
          <LangDisplay text={strings.buttons.changePassword} />
        </SettingsButton>
      </SettingsStandardItem>
      <SettingsStandardItem
        title={{ text: item.anayticsAndBugReport.title }}
        description={{ text: item.anayticsAndBugReport.description }}
      >
        <Toggle
          variant="large"
          offText={strings.toggle.off}
          onText={strings.toggle.on}
          checked={isAnalyticsAndBugReportEnabled}
          onToggle={setAnalyticsAndBugReportEnabled}
        />
      </SettingsStandardItem>
      <SettingsStandardItem
        title={{ text: item.reset.title }}
        description={{ text: item.reset.description }}
      >
        <SettingsButton
          onClick={() => dispatch(openResetCySyncDialog())}
          variant="primary"
        >
          <LangDisplay text={strings.buttons.reset} />
        </SettingsButton>
      </SettingsStandardItem>
      <SettingsStandardItem
        title={{ text: item.update.title }}
        description={{ text: item.update.description }}
      >
        <Toggle
          variant="large"
          offText={strings.toggle.off}
          onText={strings.toggle.on}
          checked={isAutoUpdateCySyncEnabled}
          onToggle={setAutoUpdateCySyncEnabled}
        />
      </SettingsStandardItem>
      <SettingsStandardItem
        title={{ text: item.usb.title }}
        description={{ text: item.usb.description }}
      >
        <SettingsButton variant="primary" onClick={console.log}>
          <LangDisplay text={strings.buttons.start} />
        </SettingsButton>
      </SettingsStandardItem>
    </>
  );
};
