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

export interface TableBoxUtilityProps
  extends WidthProps,
    HeightProps,
    FlexProps,
    DisplayProps,
    SpacingProps {}

interface TableHeaderDataProps extends TableBoxUtilityProps {
  data: string;
  $ascending: boolean;
  onClick: (name: string) => void;
  selected?: boolean;
  $noFlex?: boolean;
}

interface TableBoxDataRowProps extends TableBoxUtilityProps {
  $last?: boolean;
  $noFlex?: boolean;
}

const TableBoxStyle = styled.div`
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

const TableBoxTitleStyle = styled.div`
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

const TableDataRowStyle = styled.div<TableBoxDataRowProps>`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  flex: ${({ $noFlex }) => ($noFlex ? 'unset' : '1')};
  border-bottom-right-radius: ${({ $last }) => ($last ? '24px' : '0')};
  border-bottom-left-radius: ${({ $last }) => ($last ? '24px' : '0')};
  background: ${({ theme }) => theme.palette.background.content};

  ${flex}
  ${width}
  ${height}
  ${spacing}
  &:hover {
    background: ${({ theme }) => theme.palette.background.sideBar};
  }
`;

export const TableBox: FC<TableBoxUtilityProps> = ({ children, ...props }) => (
  <TableBoxStyle {...props}>{children}</TableBoxStyle>
);

export const TableBoxTitle: FC<TableBoxUtilityProps> = ({
  children,
  ...props
}) => <TableBoxTitleStyle {...props}>{children}</TableBoxTitleStyle>;

export const TableBoxHeader: FC<TableBoxUtilityProps> = ({
  children,
  ...props
}) => <TableHeaderStyle {...props}>{children}</TableHeaderStyle>;

export const TableBoxHeaderData: FC<TableHeaderDataProps> = ({
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

TableBoxHeaderData.defaultProps = {
  selected: false,
  $noFlex: false,
};

export const TableBody: FC<TableBoxUtilityProps> = ({ children, ...props }) => (
  <TableBodyStyle {...props}>{children}</TableBodyStyle>
);

export const TableBoxDataRow: FC<TableBoxDataRowProps> = ({
  children,
  ...props
}) => <TableDataRowStyle {...props}>{children}</TableDataRowStyle>;
TableBoxDataRow.defaultProps = {
  $noFlex: false,
  $last: false,
};
