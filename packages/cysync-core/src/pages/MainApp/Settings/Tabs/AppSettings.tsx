import { LangDisplay } from '@cypherock/cysync-ui';
import React, { useEffect, useState } from 'react';

import {
  openChangePasswordDialog,
  openRemovePasswordDialog,
  openResetCySyncDialog,
  openSetPasswordDialog,
} from '~/actions';
import { useLockscreen } from '~/context';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';
import { keyValueStore } from '~/utils';

import { SettingsButton, SettingsStandardItem } from '../components';

export const AppSettings: React.FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { item } = strings.settings.tabs.app;
  const dispatch = useAppDispatch();
  const { isPasswordSet } = useLockscreen();
  const [isAnalyticsAndBugReportEnabled, setAnalyticsAndBugReportEnabled] =
    useState<boolean | undefined>(undefined);
  const [isAutoUpdateCySyncEnabled, setAutoUpdateCySyncEnabled] = useState<
    boolean | undefined
  >(undefined);

  useEffect(() => {
    keyValueStore.isAnalyticsAndBugReportEnabled
      .get()
      .then(setAnalyticsAndBugReportEnabled);
    keyValueStore.isAutoUpdateCySyncEnabled
      .get()
      .then(setAutoUpdateCySyncEnabled);
  }, []);

  useEffect(() => {
    if (isAnalyticsAndBugReportEnabled === undefined) return;

    keyValueStore.isAnalyticsAndBugReportEnabled.set(
      isAnalyticsAndBugReportEnabled,
    );
  }, [isAnalyticsAndBugReportEnabled]);

  useEffect(() => {
    if (isAutoUpdateCySyncEnabled === undefined) return;

    keyValueStore.isAutoUpdateCySyncEnabled.set(isAutoUpdateCySyncEnabled);
  }, [isAutoUpdateCySyncEnabled]);

  return (
    <>
      <SettingsStandardItem
        title={{ text: item.password.title }}
        description={{ text: item.password.description }}
      >
        {!isPasswordSet && (
          <SettingsButton
            onClick={() => dispatch(openSetPasswordDialog())}
            variant="primary"
          >
            <LangDisplay text={strings.buttons.setPassword} />
          </SettingsButton>
        )}
        {isPasswordSet && (
          <>
            <SettingsButton
              onClick={() => dispatch(openRemovePasswordDialog())}
              variant="primary"
            >
              <LangDisplay text={strings.buttons.removePassword} />
            </SettingsButton>
            <SettingsButton
              onClick={() => dispatch(openChangePasswordDialog())}
              variant="primary"
            >
              <LangDisplay text={strings.buttons.changePassword} />
            </SettingsButton>
          </>
        )}
      </SettingsStandardItem>
      {/* TODO: enable the following setting when implemented
      <SettingsStandardItem
        title={{ text: item.anayticsAndBugReport.title }}
        description={{ text: item.anayticsAndBugReport.description }}
      >
        <Toggle
          variant="large"
          offText={strings.toggle.off}
          onText={strings.toggle.on}
          isLoading={isAnalyticsAndBugReportEnabled === undefined}
          checked={isAnalyticsAndBugReportEnabled ?? false}
          onToggle={setAnalyticsAndBugReportEnabled}
        />
      </SettingsStandardItem>
      */}
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
      {/* TODO: enable the following setting when implemented
      <SettingsStandardItem
        title={{ text: item.update.title }}
        description={{ text: item.update.description }}
      >
        <Toggle
          variant="large"
          offText={strings.toggle.off}
          onText={strings.toggle.on}
          isLoading={isAutoUpdateCySyncEnabled === undefined}
          checked={isAutoUpdateCySyncEnabled ?? false}
          onToggle={setAutoUpdateCySyncEnabled}
        />
      </SettingsStandardItem>
      */}
      {/* <SettingsStandardItem
        title={{ text: item.usb.title }}
        description={{ text: item.usb.description }}
      >
        <SettingsButton variant="primary" onClick={console.log}>
          <LangDisplay text={strings.buttons.start} />
        </SettingsButton>
      </SettingsStandardItem> */}
    </>
  );
};
