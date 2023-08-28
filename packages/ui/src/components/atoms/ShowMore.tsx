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
  margin-bottom: 20px;
  cursor: pointer;
`;

interface ShowMoreProps {
  showMoreClicked: boolean;
  handleShowMore: () => void;
  less: string;
  more: string;
}

export const ShowMore: React.FC<ShowMoreProps> = ({
  showMoreClicked,
  handleShowMore,
  less,
  more,
}) => (
  <ShowMoreWrapper onClick={handleShowMore}>
    <Typography $fontSize={20} color="muted">
      {showMoreClicked ? less : more}
    </Typography>
  </ShowMoreWrapper>
);
