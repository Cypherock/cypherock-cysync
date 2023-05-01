import React, { ReactElement } from 'react';
import { TabProps, TabStyle } from './Tabs.styled';

export const Tab = ({ children, ...props }: TabProps): ReactElement => (
  <TabStyle {...props}>{children}</TabStyle>
);
