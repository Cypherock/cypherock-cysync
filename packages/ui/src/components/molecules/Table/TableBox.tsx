import React, { FC } from 'react';
import styled from 'styled-components';

import { TriangleIcon } from '../../../assets';
import { Container, Typography } from '../../atoms';
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
    SpacingProps {
  $noFlex?: boolean;
  padding?: string;
}

interface TableHeaderDataProps extends TableBoxUtilityProps {
  data: string;
  ascending: boolean;
  onClick: (name: string) => void;
  selected?: boolean;
}

interface TableBoxDataRowProps extends TableBoxUtilityProps {
  $last?: boolean;
  index: number;
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

const TableHeaderDataStyle = styled.div<TableBoxUtilityProps>`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  flex: ${({ $noFlex }) => ($noFlex ? 'unset' : '1')};
  padding: ${({ padding }) => padding ?? '16px 20px 16px 40px'};
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
  background: ${({ theme, index }) =>
    index % 2 === 0
      ? theme.palette.background.content
      : theme.palette.background.sideBar};
  ${flex}
  ${width}
  ${height}
  ${spacing}
`;

export const TableBox: FC<TableBoxUtilityProps> = ({ children, ...props }) => (
  <TableBoxStyle {...props}>{children}</TableBoxStyle>
);
TableBox.defaultProps = {
  $noFlex: false,
  padding: undefined,
};

export const TableBoxTitle: FC<TableBoxUtilityProps> = ({
  children,
  ...props
}) => <TableBoxTitleStyle {...props}>{children}</TableBoxTitleStyle>;

TableBoxTitle.defaultProps = {
  $noFlex: false,
  padding: undefined,
};

export const TableBoxHeader: FC<TableBoxUtilityProps> = ({
  children,
  ...props
}) => <TableHeaderStyle {...props}>{children}</TableHeaderStyle>;

TableBoxHeader.defaultProps = {
  $noFlex: false,
  padding: undefined,
};

export const TableBoxHeaderData: FC<TableHeaderDataProps> = ({
  ascending,
  onClick,
  selected,
  data,
  ...props
}) => (
  <TableHeaderDataStyle
    style={{ padding: props.padding }}
    {...props}
    onClick={() => {
      onClick(data);
    }}
  >
    <Typography align="center">{data}</Typography>
    <Container display="flex" direction="column" gap={2}>
      {(() => {
        if (!selected)
          return (
            <>
              <TriangleIcon direction="up" />
              <TriangleIcon direction="down" />
            </>
          );
        if (ascending && selected) return <TriangleIcon direction="up" />;
        return <TriangleIcon direction="down" />;
      })()}
    </Container>
  </TableHeaderDataStyle>
);

TableBoxHeaderData.defaultProps = {
  selected: false,
  $noFlex: false,
  padding: undefined,
};

export const TableBody: FC<TableBoxUtilityProps> = ({ children, ...props }) => (
  <TableBodyStyle {...props}>{children}</TableBodyStyle>
);
TableBody.defaultProps = {
  $noFlex: false,
  padding: undefined,
};

export const TableBoxDataRow: FC<TableBoxDataRowProps> = ({
  children,
  ...props
}) => <TableDataRowStyle {...props}>{children}</TableDataRowStyle>;
TableBoxDataRow.defaultProps = {
  $noFlex: false,
  $last: false,
  padding: undefined,
};
