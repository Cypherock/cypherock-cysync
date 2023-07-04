import React, { FC } from 'react';
import styled from 'styled-components';

import { triangleIcon } from '../../../assets';
import { Container, Image, Typography } from '../../atoms';
import {
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
    SpacingProps {}

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
}

const TableStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-style: solid;
  border-radius: 24px;
  background-image: ${({ theme }) => theme.palette.background.primary};
  box-shadow: ${({ theme }) => theme.shadow.popup};
  border-color: ${({ theme }) => theme.palette.border.popup};
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
  border-color: ${({ theme }) => theme.palette.border.popup};
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
  border-bottom: 1px solid ${({ theme }) => theme.palette.border.table};
  justify-content: space-between;
  background-color: ${({ theme }) => theme.palette.background.input};
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
  padding: 16px 20px 16px 40px;
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
  border-bottom: 1px solid ${({ theme }) => theme.palette.border.table};
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
  flex: 1;
  align-items: center;
  justify-content: space-between;
  flex: ${({ $noFlex }) => ($noFlex ? 'unset' : '1')};
  border-bottom-right-radius: ${({ $last }) => ($last ? '24px' : '0')};
  border-bottom-left-radius: ${({ $last }) => ($last ? '24px' : '0')};
  background: ${({ theme }) => theme.palette.background.content};

  &:hover {
    background: ${({ theme }) => theme.palette.background.sideBar};
  }

  ${flex}
  ${width}
  ${height}
  ${spacing}
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
    <Typography align="center">{props.data}</Typography>
    <Container display="flex" direction="column" gap={2}>
      {!selected ? (
        <>
          <Image src={triangleIcon} alt="triangle up" />
          <Image src={triangleIcon} alt="triangle down" rotate={180} />
        </>
      ) : (
        <Image
          src={triangleIcon}
          alt="triangle"
          rotate={props.$ascending ? 0 : 180}
        />
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
};
