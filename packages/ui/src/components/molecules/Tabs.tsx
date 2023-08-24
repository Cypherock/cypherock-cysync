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
  min-height: 505px;
  max-height: 510px;
  padding-left: 40px;
  padding-right: 30px;
  margin-right: 10px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 16px;
  padding-bottom: 32px;
  max-height: 633px;
  ${utils}
`;
const TabHeaders = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-left: 40px;
  padding-right: 40px;
  width: 100%;
`;
const TabHeader = styled.div`
  cursor: pointer;
  font-weight: 400;
  flex: 1;
`;

const TabContent = styled.div`
  padding-top: 12px;
  padding-bottom: 12px;
`;

const StyledTypography = styled(Typography)<{ $active: boolean }>`
  padding: 12px 0;
  position: relative;
  text-align: center;
  display: block;
  width: 100%;
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
