import React, { FC, useState } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { MainAppLayout } from '../Components';
import {
  Container,
  Divider,
  Flex,
  LangDisplay,
  Typography,
  useTheme,
} from '@cypherock/cysync-ui';
import { Tab } from '@cypherock/cysync-ui/src';
import { GeneralSettings, AppSettings, DeviceSettings, About } from './Tabs';

export const Settings: FC = () => {
  const { strings } = useAppSelector(selectLanguage);

  const tabs: Tab[] = [
    {
      label: strings.settings.tabs.general.title,
      content: <GeneralSettings />,
    },
    {
      label: strings.settings.tabs.app.title,
      content: <AppSettings />,
    },
    {
      label: strings.settings.tabs.device.title,
      content: <DeviceSettings />,
    },
    {
      label: strings.settings.tabs.about.title,
      content: <About />,
    },
  ];

  const [tabIndex, setTabIndex] = useState<number>(0);
  const theme = useTheme();

  return (
    <MainAppLayout title={strings.sidebar.settings}>
      <Container
        m={{ def: 2, lg: '20' }}
        $borderRadius={24}
        shadow="popup"
        direction="column"
        align="stretch"
        $borderWidth={0}
      >
        <Flex
          pt={{ def: 4, lg: 6 }}
          pb={4}
          px={{ def: 3, lg: 5 }}
          direction="column"
          align="stretch"
        >
          <Flex gap={24}>
            {tabs.map((tab, index) => (
              <Flex
                key={tab.label}
                direction="column"
                align="center"
                gap={{ def: 20, lg: 21 }}
                $cursor="pointer"
                onClick={() => setTabIndex(index)}
              >
                <Typography
                  px={3}
                  $fontSize={20}
                  color={index === tabIndex ? 'gold' : 'muted'}
                >
                  <LangDisplay text={tab.label} />
                </Typography>
                <Divider
                  variant="horizontal"
                  height={{ def: 4, lg: 3 }}
                  background={
                    index === tabIndex ? theme.palette.golden : 'none'
                  }
                />
              </Flex>
            ))}
          </Flex>
          <Divider variant="horizontal" />
        </Flex>
        {tabs[tabIndex].content}
      </Container>
    </MainAppLayout>
  );
};
