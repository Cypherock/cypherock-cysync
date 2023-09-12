import React from 'react';
import { TabItem } from './TabItem';
import { Flex, LangDisplay, Typography } from '@cypherock/cysync-ui';
import { LangDisplayProps } from '@cypherock/cysync-ui/src';

export interface SettingsStandardItemProps {
  title: LangDisplayProps;
  description: LangDisplayProps;
  children: React.ReactNode | React.ReactNode[];
}

export const SettingsStandardItem: React.FC<SettingsStandardItemProps> = ({
  title,
  description,
  children,
}) => (
  <TabItem>
    <Flex direction="column" align="stretch">
      <Typography $fontSize={20} color="white">
        <LangDisplay {...title} />
      </Typography>
      <Typography $fontSize={16} color="muted">
        <LangDisplay {...description} />
      </Typography>
    </Flex>
    <Flex gap={16} direction={{ def: 'column', lg: 'row' }}>
      {children}
    </Flex>
  </TabItem>
);
