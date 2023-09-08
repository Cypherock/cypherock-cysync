import React, { useState } from 'react';
import styled from 'styled-components';

import { Typography } from '../atoms';
import { FlexProps, goldenGradient, utils } from '../utils';

export interface Tab {
  label: string;
  content: React.ReactNode;
}
interface TabsProps {
  tabs: Tab[];
  $alignContent?: FlexProps['$alignSelf'];
}

export const TabContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  color: white;
  padding-left: 40px;
  padding-right: 30px;
  margin-right: 10px;
`;

const TabsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 16px;
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

const TabContent = styled.div<{ $align: FlexProps['$alignSelf'] }>`
  padding-top: 12px;
  padding-bottom: 12px;
  align-self: ${props => props.$align};
  width: 100%;
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

export const Tabs: React.FC<TabsProps> = ({ tabs, $alignContent }) => {
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
      <TabContent $align={$alignContent}>{tabs[activeTab].content}</TabContent>
    </TabsContainer>
  );
};

Tabs.defaultProps = {
  $alignContent: 'initial',
};
