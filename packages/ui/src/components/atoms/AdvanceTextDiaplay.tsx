import React, { ReactNode } from 'react';
import styled from 'styled-components';

const AdvanceTextContainer = styled.div`
  padding: 8px 16px;
  gap: 16px;

  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.palette.border.infoBox};
  background: ${({ theme }) => theme.palette.background.input};
  color: #8b8682;

  overflow-y: scroll;
  width: 100%;

  max-height: 112px;

  &::-webkit-scrollbar-thumb {
    background-color: #46403c;
    border-radius: 6px;
  }
`;

const AdvanceTextContent = styled.div`
  height: fit-content;
  word-break: break-all;
  text-align: left;

  font-size: 16px;
  font-weight: 300;
`;

export const AdvanceTextDisplay: React.FC<{ children?: ReactNode }> = ({
  children,
}) => (
  <AdvanceTextContainer>
    <AdvanceTextContent>{children}</AdvanceTextContent>
  </AdvanceTextContainer>
);

AdvanceTextDisplay.defaultProps = {
  children: undefined,
};
