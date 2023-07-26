import React, { useState } from 'react';
import styled from 'styled-components';
import { utils } from '../utils';
import { goldenGradient } from '../atoms/Gradient';

interface Tab {
  label: string;
  content: React.ReactNode;
}
interface TabsProps {
  tabs: Tab[];
}
const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  ${utils}
`;
const TabHeaders = styled.div`
  display: flex;
`;
const TabHeader = styled.div<{ active: boolean }>`
  padding: 12px 24px;
  cursor: pointer;
  font-weight: 400;
  color: ${({ theme, active }) =>
    active ? `${goldenGradient('color')}` : theme.palette.text.muted};
  border-bottom: 2px solid
    ${({ theme, active }) => (active ? `${theme.palette.border.gold}` : 'none')};
`;
const TabContent = styled.div`
  padding: 12px;
`;
export const Tabs: React.FC<TabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };
  return (
    <TabsContainer>
      <TabHeaders>
        {tabs.map((tab, index) => (
          <TabHeader
            key={tab.label}
            active={index === activeTab}
            onClick={() => handleTabClick(index)}
          >
            {tab.label}
          </TabHeader>
        ))}
      </TabHeaders>
      <TabContent>{tabs[activeTab].content}</TabContent>
    </TabsContainer>
  );
};
