import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { TriangleIcon } from '../../../../assets';
import { Container, Typography } from '../../../atoms';

export const TableHeaderWrapper = styled.div`
  display: flex;
  background: ${({ theme }) => theme.palette.background.input};
`;

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 16px 16px 0px;
  box-sizing: border-box;
  cursor: pointer;
`;

export interface TableHeaderComponentProps {
  headers: {
    name: string;
    Wrapper: React.FC<{ children: ReactNode; onClick: () => void }>;
    text: string;
    isSortable: boolean;
  }[];
  onSort: (key: string) => void;
  selected: string;
  $ascending: boolean;
}

export const TableHeaderComponent: React.FC<TableHeaderComponentProps> = ({
  headers,
  onSort,
  $ascending,
  selected,
}) => {
  const getSortIcon = (key: string) => (
    <Container display="flex" direction="column" gap={2}>
      {selected === key ? (
        <TriangleIcon rotate={$ascending ? 0 : 180} />
      ) : (
        <>
          <TriangleIcon />
          <TriangleIcon rotate={180} />
        </>
      )}
    </Container>
  );

  return (
    <TableHeaderWrapper>
      {headers.map(header => (
        <header.Wrapper
          onClick={() => header.isSortable && onSort(header.name)}
          key={header.name}
        >
          <Typography color="muted">{header.text}</Typography>
          {header.isSortable && getSortIcon(header.name)}
        </header.Wrapper>
      ))}
    </TableHeaderWrapper>
  );
};
