import React from 'react';
import { styled } from 'styled-components';

import { Typography } from './Typography';

const ShowMoreWrapper = styled.div`
  display: flex;
  height: 56px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-radius: 8px;
  border: 1px dashed ${({ theme }) => theme.palette.border.muted};
  box-shadow: ${({ theme }) => theme.palette.shadow.popup};
  margin-top: 16px;
  cursor: pointer;
`;

interface ShowMoreProps {
  text: string;
  onClick: () => void;
}

export const ShowMore: React.FC<ShowMoreProps> = ({ text, onClick }) => (
  <ShowMoreWrapper onClick={onClick}>
    <Typography $fontSize={20} color="muted">
      {text}
    </Typography>
  </ShowMoreWrapper>
);
