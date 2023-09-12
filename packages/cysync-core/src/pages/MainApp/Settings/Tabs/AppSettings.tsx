import React, { useState } from 'react';
import { LangDisplay, Toggle, Typography } from '@cypherock/cysync-ui';
import { SettingsStandardItem, SettingsButton } from '../components';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';
import {
  openChangePasswordDialog,
  openRemovePasswordDialog,
  openResetCySyncDialog,
  openSetPasswordDialog,
} from '~/actions';

export const AppSettings: React.FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { item } = strings.settings.tabs.app;
  const dispatch = useAppDispatch();
  const [isAnalyticsAndBugReportEnabled, setAnalyticsAndBugReportEnabled] =
    useState<boolean>(false);
  const [isAutoUpdateCySyncEnabled, setAutoUpdateCySyncEnabled] =
    useState<boolean>(false);

  return (
    <>
      <SettingsStandardItem
        title={{ text: item.password.title }}
        description={{ text: item.password.description }}
      >
        <SettingsButton
          display="none"
          onClick={() => dispatch(openSetPasswordDialog())}
          variant="primary"
        >
          <LangDisplay text={strings.buttons.setPassword} />
        </SettingsButton>
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
      </SettingsStandardItem>
      <SettingsStandardItem
        title={{ text: item.anayticsAndBugReport.title }}
        description={{ text: item.anayticsAndBugReport.description }}
      >
        <Toggle
          $discSize={24}
          $discMargin={4}
          $width={72}
          checkedNode={
            <Typography
              $textAlign="center"
              $fontWeight="semibold"
              color="black"
            >
              <LangDisplay text={strings.toggle.on} />
            </Typography>
          }
          unCheckedNode={
            <Typography
              $textAlign="center"
              $fontWeight="semibold"
              color="muted"
            >
              <LangDisplay text={strings.toggle.off} />
            </Typography>
          }
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
          $discSize={24}
          $discMargin={4}
          $width={72}
          checkedNode={
            <Typography
              $textAlign="center"
              $fontWeight="semibold"
              color="black"
            >
              <LangDisplay text={strings.toggle.on} />
            </Typography>
          }
          unCheckedNode={
            <Typography
              $textAlign="center"
              $fontWeight="semibold"
              color="muted"
            >
              <LangDisplay text={strings.toggle.off} />
            </Typography>
          }
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
