import { Flex, LangDisplay, Toggle, Typography } from '@cypherock/cysync-ui';
import React from 'react';

import {
  openChangePasswordDialog,
  openRemovePasswordDialog,
  openResetCySyncDialog,
  openSetPasswordDialog,
} from '~/actions';
import { selectLanguage, useAppDispatch, useAppSelector } from '~/store';

import { SettingsButton, TabItem } from '../components';

export const AppSettings: React.FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { item } = strings.settings.tabs.app;
  const dispatch = useAppDispatch();
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
            <LangDisplay text={item.password} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.passwordDesc} />
          </Typography>
        </Flex>
        <Flex gap={16} direction="column">
          <SettingsButton
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
            <LangDisplay text={item.anayticsAndBugReport} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.anayticsAndBugReportDesc} />
          </Typography>
        </Flex>
        <Flex>
          <Toggle checked={false} />
        </Flex>
      </TabItem>
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.reset} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.resetDesc} />
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
            <LangDisplay text={item.update} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.updateDesc} />
          </Typography>
        </Flex>
        <Flex>
          <Toggle checked={false} />
        </Flex>
      </TabItem>
      <TabItem>
        <Flex direction="column" align="stretch">
          <Typography $fontSize={20} color="white">
            <LangDisplay text={item.usb} />
          </Typography>
          <Typography $fontSize={16} color="muted">
            <LangDisplay text={item.usbDesc} />
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
