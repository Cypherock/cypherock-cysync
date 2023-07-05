import React, { FC } from 'react';
import styled from 'styled-components';

import { Typography } from '../../atoms';

interface MutedTextBoxProps {
  text: string;
}

const MutedTextBoxStyle = styled.div`
  border: 1px solid ${({ theme }) => theme.palette.border.muted};
  padding: 2px 8px;
  border-radius: 4px;
`;

export const TableMutedTextBox: FC<MutedTextBoxProps> = ({ text }) => (
  <MutedTextBoxStyle>
    <Typography variant="p" $fontSize={12} color="muted">
      {text}
    </Typography>
  </MutedTextBoxStyle>
);
