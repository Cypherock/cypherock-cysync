import React, { FC } from 'react';
import styled from 'styled-components';

import { Typography } from '../../atoms';

interface TableGroupRowProps {
  text: string;
}

const TableGroupRowStyle = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 16px 40px;
  background-color: ${({ theme }) => theme.palette.background.toggleActive};
`;

export const TableGroupRow: FC<TableGroupRowProps> = ({ text }) => (
  <TableGroupRowStyle>
    <Typography variant="span">{text}</Typography>
  </TableGroupRowStyle>
);
