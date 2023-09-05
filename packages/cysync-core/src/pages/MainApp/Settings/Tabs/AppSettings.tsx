import React from 'react';
import {
  Button,
  Flex,
  LangDisplay,
  Toggle,
  Typography,
} from '@cypherock/cysync-ui';
import { TabItem } from '../components';
import { selectLanguage, useAppSelector } from '~/store';

export const AppSettings: React.FC = () => {
  const { strings } = useAppSelector(selectLanguage);
  const { item } = strings.settings.tabs.app;
  return (
    <Flex
      $alignSelf="stretch"
      direction="column"
      align="stretch"
      px={5}
      py={4}
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
        <Flex>
          <Button variant="primary" onClick={console.log}>
            <LangDisplay text={strings.buttons.setPassword} />
          </Button>
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
          <Button variant="primary" onClick={console.log}>
            <LangDisplay text={strings.buttons.reset} />
          </Button>
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
          <Button variant="primary" onClick={console.log}>
            <LangDisplay text={strings.buttons.start} />
          </Button>
        </Flex>
      </TabItem>
    </Flex>
  );
};
