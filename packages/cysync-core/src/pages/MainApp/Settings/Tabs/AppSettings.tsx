import React, { useState } from 'react';
import { Flex, LangDisplay, Toggle, Typography } from '@cypherock/cysync-ui';
import { SettingsButton, TabItem } from '../components';
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
            <LangDisplay text={item.password.title} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.password.description} />
          </Typography>
        </Flex>
        <Flex gap={16} direction={{ def: 'column', lg: 'row' }}>
          <SettingsButton
            display="none"
            variant="primary"
            justify="center"
            onClick={() => dispatch(openSetPasswordDialog())}
          >
            <LangDisplay text={strings.buttons.setPassword} />
          </SettingsButton>
          <SettingsButton
            variant="primary"
            justify="center"
            onClick={() => dispatch(openRemovePasswordDialog())}
          >
            <LangDisplay text={strings.buttons.removePassword} />
          </SettingsButton>
          <SettingsButton
            variant="primary"
            justify="center"
            onClick={() => dispatch(openChangePasswordDialog())}
          >
            <LangDisplay text={strings.buttons.changePassword} />
          </SettingsButton>
        </Flex>
      </TabItem>
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.anayticsAndBugReport.title} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.anayticsAndBugReport.description} />
          </Typography>
        </Flex>
        <Flex>
          <Toggle
            discSize={24}
            discMargin={4}
            width={72}
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
        </Flex>
      </TabItem>
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.reset.title} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.reset.description} />
          </Typography>
        </Flex>
        <Flex>
          <SettingsButton
            variant="primary"
            onClick={() => dispatch(openResetCySyncDialog())}
          >
            <LangDisplay text={strings.buttons.reset} />
          </SettingsButton>
        </Flex>
      </TabItem>
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.update.title} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.update.description} />
          </Typography>
        </Flex>
        <Flex>
          <Toggle
            discSize={24}
            discMargin={4}
            width={72}
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
        </Flex>
      </TabItem>
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.usb.title} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.usb.description} />
          </Typography>
        </Flex>
        <Flex>
          <SettingsButton variant="primary" onClick={console.log}>
            <LangDisplay text={strings.buttons.start} />
          </SettingsButton>
        </Flex>
      </TabItem>
    </Flex>
  );
};
