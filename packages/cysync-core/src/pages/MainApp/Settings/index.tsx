import React, { FC } from 'react';

import { selectLanguage, useAppSelector } from '~/store';

import { MainAppLayout } from '../Components';
import { Tabs } from '@cypherock/cysync-ui';
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

  return (
    <MainAppLayout title={strings.sidebar.settings}>
      <Tabs tabs={tabs} $alignContent="stretch" />
    </MainAppLayout>
  );
};
