import { FC } from 'react';
import styled from 'styled-components/native';
import { Loader, Typography } from '../../atoms';
import Octicons from '@expo/vector-icons/Octicons';
import React from 'react';
import { SortIcon } from '../../icons';
import {
  PressableProps,
  SectionBase,
  TouchableOpacityProps,
  View,
} from 'react-native';

interface TableHeaderDataProps extends TouchableOpacityProps {
  data: string;
  ascending: boolean;
  selected?: boolean;
}

interface TableDataRowProps extends PressableProps {
  index: number;
}

interface TableBodyProps {
  type: 'section' | 'flat';
  data?: any[] | readonly SectionBase<unknown, unknown>[];
  renderItem: (item: any) => JSX.Element;
  renderSectionHeader?: (section: any) => JSX.Element;
  seperator?: (item: any) => JSX.Element;
  isLoading?: boolean;
}

export const Table = styled.View`
  flex: 1;
  width: 100%;
  justify-content: flex-start;
`;

export const TableHeader = styled.View`
  width: 100%;
  flex-direction: row;
`;

export const TableRowData = styled.Pressable<TableDataRowProps>`
  width: 100%;
  flex-direction: row;
  background: ${({ theme, index }) =>
    index % 2
      ? theme.palette.background.tableRow2
      : theme.palette.background.tableRow1};
`;

export const TableCell = styled.View`
  flex: 1;
  flex-direction: row;
  padding-horizontal: 12px;
  padding-vertical: 16px;
  justify-content: space-between;
  align-self: flex-start;
  align-items: flex-start;
`;

export const TableHeaderCell = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  padding-horizontal: 12px;
  padding-vertical: 16px;
  justify-content: space-between;
  align-self: flex-start;
  align-items: flex-start;
`;

const TableFlatListBody = styled.FlatList`
  flex: 1;
  width: 100%;
`;

const TableSectionListBody = styled.SectionList`
  flex: 1;
  width: 100%;
`;

export const TableHeaderData: FC<TableHeaderDataProps> = ({
  data,
  selected,
  ascending,
  ...props
}) => {
  return (
    <TableHeaderCell {...props}>
      <Typography type="h5" color="muted">
        {data}
      </Typography>
      <View
        style={{
          alignSelf: 'center',
        }}
      >
        {!selected ? (
          <>
            <SortIcon />
          </>
        ) : ascending ? (
          <Octicons name="triangle-up" size={16} color={'white'} />
        ) : (
          <Octicons name="triangle-down" size={16} color={'white'} />
        )}
      </View>
    </TableHeaderCell>
  );
};

export const TableBody: FC<TableBodyProps> = ({
  type,
  data,
  renderItem,
  renderSectionHeader,
  seperator,
  isLoading,
}) => {
  if (!data) return null;
  if (isLoading)
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Loader />
      </View>
    );

  return type === 'section' ? (
    <TableSectionListBody
      sections={data}
      renderItem={renderItem}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={(item, index) => index.toString()}
      ItemSeparatorComponent={seperator}
    />
  ) : (
    <TableFlatListBody
      data={data}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      ItemSeparatorComponent={seperator}
    />
  );
};
