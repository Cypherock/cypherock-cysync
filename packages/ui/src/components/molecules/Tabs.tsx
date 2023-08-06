import React, { useState } from 'react';
import styled from 'styled-components';

import { Typography } from '../atoms';
import { goldenGradient, utils } from '../utils';

interface Tab {
  label: string;
  content: React.ReactNode;
}
interface TabsProps {
  tabs: Tab[];
}

export const TabContentContainer = styled.div`
  min-height: 200px;
  display: flex;
  flex-direction: column;
  color: white;
`;

const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${utils}
`;
const TabHeaders = styled.div`
  display: flex;
`;
const TabHeader = styled.div`
  cursor: pointer;
  font-weight: 400;
`;
const TabContent = styled.div`
  padding: 12px;
`;

const StyledTypography = styled(Typography)<{ $active: boolean }>`
  padding: 12px 24px;
  position: relative;
  display: inline-block;
  color: ${({ theme, $active }) =>
    $active ? `${goldenGradient('color')}` : theme.palette.text.muted};
  &::before {
    content: ${({ $active }) => ($active ? "''" : 'none')};
    position: absolute;
    inset: 0;
    border-bottom: 1px solid transparent;
    background: ${props => props.theme.palette.golden} border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
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
          <TabHeader key={tab.label} onClick={() => handleTabClick(index)}>
            <StyledTypography
              variant="span"
              $active={index === activeTab}
              $fontSize={16}
              $fontWeight="normal"
            >
              {tab.label}
            </StyledTypography>
          </TabHeader>
        ))}
      </TabHeaders>
      <TabContent>{tabs[activeTab].content}</TabContent>
    </TabsContainer>
  );
};
