import React, { FC } from 'react';
import styled from 'styled-components';

import { Typography } from '../../atoms';

interface TableGroupRowProps {
  text: string;
  style?: any;
}

const TableGroupRowStyle = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 16px 40px;
  background-color: ${({ theme }) => theme.palette.background.toggleActive};
  border-bottom: 1px solid ${({ theme }) => theme.palette.border.table.row};
`;

export const TableGroupRow: FC<TableGroupRowProps> = ({ text, style }) => (
  <TableGroupRowStyle style={style}>
    <Typography variant="span">{text}</Typography>
  </TableGroupRowStyle>
);

TableGroupRow.defaultProps = {
  style: undefined,
};
