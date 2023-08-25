import React, { FC } from 'react';
import styled from 'styled-components';

import { Typography } from '../../atoms';

interface HistoryDateBoxProps {
  text: string;
}

export const HistoryContainer = styled.div`
  max-height: 90vh;
  overflow-y: scroll;
  overflow-x: hidden;
  border-radius: 24px;
`;

const HistoryDateBoxStyle = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 16px 40px;
  background-color: ${({ theme }) => theme.palette.background.toggleActive};
`;

export const HistoryDateBox: FC<HistoryDateBoxProps> = ({ text }) => (
  <HistoryDateBoxStyle>
    <Typography variant="span">{text}</Typography>
  </HistoryDateBoxStyle>
);
