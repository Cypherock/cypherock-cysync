import React, { FC } from 'react';
import styled from 'styled-components';

import { TriangleIcon } from '../../../assets';
import { Container, Typography } from '../../atoms';
import {
  bgColor,
  BgColorProps,
  DisplayProps,
  flex,
  FlexProps,
  height,
  HeightProps,
  spacing,
  SpacingProps,
  width,
  WidthProps,
} from '../../utils';

export interface TableUtilityProps
  extends WidthProps,
    HeightProps,
    FlexProps,
    DisplayProps,
    SpacingProps,
    BgColorProps {}

interface TableHeaderDataProps extends TableUtilityProps {
  data: string;
  $ascending: boolean;
  onClick: (name: string) => void;
  selected?: boolean;
  $noFlex?: boolean;
}

interface TableDataRowProps extends TableUtilityProps {
  $last?: boolean;
  $noFlex?: boolean;
  $index: number;
  onClick?: () => void;
}

const TableStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 24px;
  border: none;
  background-image: ${({ theme }) => theme.palette.background.primary};
  box-shadow: ${({ theme }) => theme.shadow.popup};
  text-align: center;
  ${flex}
  ${width}
  ${height}
  ${spacing}
`;

const TableTitleStyle = styled.div`
  border-bottom: 1px;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-style: solid;
  padding: 16px 40px;
  border-color: ${({ theme }) => theme.palette.border.table.title};
  color: ${({ theme }) => theme.palette.text.mutedText};
  ${flex}
  ${width}
  ${height}
  ${spacing}
`;

const TableHeaderStyle = styled.div`
  display: flex;
  align-items: flex-start;
  align-self: flex-start;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.palette.background.input};
  border-bottom: 1px solid ${({ theme }) => theme.palette.border.table.row};
  ${flex}
  ${width}
  ${height}
  ${spacing}
`;

const TableHeaderDataStyle = styled.div<TableHeaderDataProps>`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  flex: ${({ $noFlex }) => ($noFlex ? 'unset' : '1')};
  padding: 16px;

  @media ${({ theme }) => theme.screens.lg} {
    padding: 16px 20px 16px 40px;
  }

  ${flex}
  ${width}
  ${height}
  ${spacing}
`;

const TableBodyStyle = styled.div`
  display: flex;
  align-items: flex-start;
  align-self: flex-start;
  height: fit-content;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.palette.background.input};
  border-bottom-right-radius: 24px;
  border-bottom-left-radius: 24px;
  ${flex}
  ${width}
  ${height}
  ${spacing}
`;

const TableDataRowStyle = styled.div<TableDataRowProps>`
  display: flex;
  position: relative;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  flex: ${({ $noFlex }) => ($noFlex ? 'unset' : '1')};
  border-bottom-right-radius: ${({ $last }) => ($last ? '24px' : '0')};
  border-bottom-left-radius: ${({ $last }) => ($last ? '24px' : '0')};
  ${({ $last, theme }) =>
    !$last && `border-bottom: 1px solid ${theme.palette.border.table.row};`}
  background: ${({ $index, theme }) =>
    $index % 2 === 0
      ? theme.palette.background.content
      : theme.palette.background.primary};

  &:hover {
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      border: 1px solid transparent;
      border-bottom-right-radius: ${({ $last }) => ($last ? '24px' : '0')};
  border-bottom-left-radius: ${({ $last }) => ($last ? '24px' : '0')};
      background: ${({ theme }) => theme.palette.golden};
      -webkit-mask: linear-gradient(#fff 0 0) padding-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }

    &:hover::before {
      background: ${({ theme }) => theme.palette.golden} border-box;
      transition: all 0.3s;
      ease-out;
    }
    cursor: pointer;
  }

  ${flex}
  ${width}
  ${height}
  ${spacing}
  ${bgColor}
`;

export const Table: FC<TableUtilityProps> = ({ children, ...props }) => (
  <TableStyle {...props}>{children}</TableStyle>
);

export const TableTitle: FC<TableUtilityProps> = ({ children, ...props }) => (
  <TableTitleStyle {...props}>{children}</TableTitleStyle>
);

export const TableHeader: FC<TableUtilityProps> = ({ children, ...props }) => (
  <TableHeaderStyle {...props}>{children}</TableHeaderStyle>
);

export const TableHeaderData: FC<TableHeaderDataProps> = ({
  onClick,
  selected,
  ...props
}) => (
  <TableHeaderDataStyle
    {...props}
    onClick={() => {
      onClick(props.data);
    }}
  >
    <Typography align="center" color="muted">
      {props.data}
    </Typography>
    <Container display="flex" direction="column" gap={2}>
      {!selected ? (
        <>
          <TriangleIcon />
          <TriangleIcon rotate={180} />
        </>
      ) : (
        <TriangleIcon rotate={props.$ascending ? 0 : 180} />
      )}
    </Container>
  </TableHeaderDataStyle>
);

TableHeaderData.defaultProps = {
  selected: false,
  $noFlex: false,
};

export const TableBody: FC<TableUtilityProps> = ({ children, ...props }) => (
  <TableBodyStyle {...props}>{children}</TableBodyStyle>
);

export const TableDataRow: FC<TableDataRowProps> = ({ children, ...props }) => (
  <TableDataRowStyle {...props}>{children}</TableDataRowStyle>
);
TableDataRow.defaultProps = {
  $noFlex: false,
  $last: false,
  onClick: undefined,
};
